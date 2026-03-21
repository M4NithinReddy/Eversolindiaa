import { useState } from 'react';
import { useAdmin, AdminModule } from '@/context/AdminContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Plus, Pencil, Trash2, Package, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ModuleManagerProps {
  onSelectModule: (mod: AdminModule) => void;
  selectedModuleId?: string;
}

const ModuleManager = ({ onSelectModule, selectedModuleId }: ModuleManagerProps) => {
  const { data, addModule, updateModule, deleteModule, modulesLoading, modulesError, modulesBusy } = useAdmin();
  const [newName,     setNewName]     = useState('');
  const [editId,      setEditId]      = useState<string | null>(null);
  const [editName,    setEditName]    = useState('');
  const [createOpen,  setCreateOpen]  = useState(false);
  const [editOpen,    setEditOpen]    = useState(false);
  const [deletingId,  setDeletingId]  = useState<string | null>(null);

  const handleCreate = async () => {
    if (!newName.trim()) return;
    await addModule(newName.trim());
    setNewName(''); setCreateOpen(false);
  };

  const handleUpdate = async () => {
    if (!editId || !editName.trim()) return;
    await updateModule(editId, editName.trim());
    setEditId(null); setEditName(''); setEditOpen(false);
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    await deleteModule(id);
    setDeletingId(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Package className="w-5 h-5 text-emerald-600" /> Modules
          {modulesLoading && <Loader2 className="w-4 h-4 text-emerald-400 animate-spin" />}
        </h2>

        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1" disabled={modulesLoading || modulesBusy}>
              <Plus className="w-4 h-4" /> New
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white border-gray-200">
            <DialogHeader><DialogTitle className="text-gray-900">Create Module</DialogTitle></DialogHeader>
            <Input placeholder="Module name" value={newName} onChange={e => setNewName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !modulesBusy && handleCreate()}
              disabled={modulesBusy} className="bg-gray-50 border-gray-300 text-gray-900" />
            <DialogFooter>
              <DialogClose asChild><Button variant="outline" disabled={modulesBusy}>Cancel</Button></DialogClose>
              <Button onClick={handleCreate} disabled={modulesBusy || !newName.trim()} className="bg-emerald-600 hover:bg-emerald-700 gap-2">
                {modulesBusy ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</> : 'Create'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="bg-white border-gray-200">
          <DialogHeader><DialogTitle className="text-gray-900">Edit Module</DialogTitle></DialogHeader>
          <Input value={editName} onChange={e => setEditName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !modulesBusy && handleUpdate()}
            disabled={modulesBusy} className="bg-gray-50 border-gray-300 text-gray-900" />
          <DialogFooter>
            <DialogClose asChild><Button variant="outline" disabled={modulesBusy}>Cancel</Button></DialogClose>
            <Button onClick={handleUpdate} disabled={modulesBusy || !editName.trim()} className="bg-emerald-600 hover:bg-emerald-700 gap-2">
              {modulesBusy ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</> : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Error */}
      {modulesError && (
        <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <div className="flex-1"><p className="font-medium">Failed to load modules</p><p className="text-xs text-red-500">{modulesError}</p></div>
          <button onClick={() => window.location.reload()} className="text-red-500 hover:text-red-700 flex items-center gap-1 text-xs">
            <RefreshCw className="w-3 h-3" /> Retry
          </button>
        </div>
      )}

      {/* Loading skeleton */}
      {modulesLoading && data.modules.length === 0 && (
        <div className="space-y-2">{[1,2,3].map(i => <div key={i} className="h-12 rounded-lg bg-gray-100 animate-pulse" />)}</div>
      )}

      <AnimatePresence>
        {!modulesLoading && data.modules.length === 0 && !modulesError ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-8 text-gray-400">
            <Package className="w-12 h-12 mx-auto mb-3 opacity-40" />
            <p className="text-sm">No modules yet. Create one to get started.</p>
          </motion.div>
        ) : (
          <div className="space-y-2">
            {data.modules.map(mod => (
              <motion.div key={mod.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <Card className={`cursor-pointer transition-all duration-200 border ${selectedModuleId === mod.id ? 'bg-emerald-50 border-emerald-300 shadow-md' : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm'}`}
                  onClick={() => onSelectModule(mod)}>
                  <CardContent className="p-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${selectedModuleId === mod.id ? 'bg-emerald-500' : 'bg-gray-300'}`} />
                      <span className="text-gray-900 font-medium text-sm">{mod.name}</span>
                      <span className="text-xs text-gray-400">({data.brands.filter(b => b.moduleId === mod.id).length} brands)</span>
                    </div>
                    <div className="flex gap-1" onClick={e => e.stopPropagation()}>
                      <Button size="icon" variant="ghost" className="h-7 w-7 text-gray-400 hover:text-gray-700"
                        disabled={modulesBusy} onClick={() => { setEditId(mod.id); setEditName(mod.name); setEditOpen(true); }}>
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                      <Button size="icon" variant="ghost" className="h-7 w-7 text-gray-400 hover:text-red-500 hover:bg-red-50"
                        disabled={modulesBusy} onClick={() => handleDelete(mod.id)}>
                        {deletingId === mod.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ModuleManager;
