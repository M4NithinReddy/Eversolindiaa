import { useState } from 'react';
import { useAdmin, AdminModule } from '@/context/AdminContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Plus, Pencil, Trash2, Package } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ModuleManagerProps {
  onSelectModule: (mod: AdminModule) => void;
  selectedModuleId?: string;
}

const ModuleManager = ({ onSelectModule, selectedModuleId }: ModuleManagerProps) => {
  const { data, addModule, updateModule, deleteModule } = useAdmin();
  const [newName, setNewName] = useState('');
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const handleCreate = () => {
    if (newName.trim()) {
      addModule(newName.trim());
      setNewName('');
      setCreateOpen(false);
    }
  };

  const handleUpdate = () => {
    if (editId && editName.trim()) {
      updateModule(editId, editName.trim());
      setEditId(null);
      setEditName('');
      setEditOpen(false);
    }
  };

  const startEdit = (mod: AdminModule) => {
    setEditId(mod.id);
    setEditName(mod.name);
    setEditOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Package className="w-5 h-5 text-emerald-600" />
          Modules
        </h2>
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1">
              <Plus className="w-4 h-4" /> New
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white border-gray-200">
            <DialogHeader>
              <DialogTitle className="text-gray-900">Create Module</DialogTitle>
            </DialogHeader>
            <Input
              placeholder="Module name (e.g., Solar Modules)"
              value={newName}
              onChange={e => setNewName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleCreate()}
              className="bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-400"
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" className="border-gray-300 text-gray-600">Cancel</Button>
              </DialogClose>
              <Button onClick={handleCreate} className="bg-emerald-600 hover:bg-emerald-700">Create</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="bg-white border-gray-200">
          <DialogHeader>
            <DialogTitle className="text-gray-900">Edit Module</DialogTitle>
          </DialogHeader>
          <Input
            value={editName}
            onChange={e => setEditName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleUpdate()}
            className="bg-gray-50 border-gray-300 text-gray-900"
          />
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" className="border-gray-300 text-gray-600">Cancel</Button>
            </DialogClose>
            <Button onClick={handleUpdate} className="bg-emerald-600 hover:bg-emerald-700">Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AnimatePresence>
        {data.modules.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8 text-gray-400"
          >
            <Package className="w-12 h-12 mx-auto mb-3 opacity-40" />
            <p className="text-sm">No modules yet. Create one to get started.</p>
          </motion.div>
        ) : (
          <div className="space-y-2">
            {data.modules.map(mod => (
              <motion.div
                key={mod.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <Card
                  className={`cursor-pointer transition-all duration-200 border ${
                    selectedModuleId === mod.id
                      ? 'bg-emerald-50 border-emerald-300 shadow-md shadow-emerald-100'
                      : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm'
                  }`}
                  onClick={() => onSelectModule(mod)}
                >
                  <CardContent className="p-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${selectedModuleId === mod.id ? 'bg-emerald-500' : 'bg-gray-300'}`} />
                      <span className="text-gray-900 font-medium text-sm">{mod.name}</span>
                      <span className="text-xs text-gray-400">
                        ({data.brands.filter(b => b.moduleId === mod.id).length} brands)
                      </span>
                    </div>
                    <div className="flex gap-1" onClick={e => e.stopPropagation()}>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7 text-gray-400 hover:text-gray-700 hover:bg-gray-100"
                        onClick={() => startEdit(mod)}
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7 text-gray-400 hover:text-red-500 hover:bg-red-50"
                        onClick={() => deleteModule(mod.id)}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
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
