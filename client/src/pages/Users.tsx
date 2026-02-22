import { useEffect, useState } from "react";
import { Modal } from "../components/ui/Modal";
import api from "../services/api";
import { useAuthStore } from "../stores/authStore";
import { getInitials } from "../lib/utils";
import { Plus, Shield, ShieldCheck, User as UserIcon, Mail, MessageCircle } from "lucide-react";
import type { UserRole } from "../types";

interface UserData {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  telegramChatId?: string;
  isActive: boolean;
  createdAt: string;
  _count: {
    assignedDeliveries: number;
  };
}

const ROLE_CONFIG: Record<UserRole, { label: string; icon: typeof Shield; color: string; bg: string }> = {
  ADMIN: { label: "Admin", icon: ShieldCheck, color: "text-red-700", bg: "bg-red-50" },
  MANAGER: { label: "Manager", icon: Shield, color: "text-blue-700", bg: "bg-blue-50" },
  MEMBER: { label: "Miembro", icon: UserIcon, color: "text-gray-700", bg: "bg-gray-50" },
};

export function Users() {
  const { user: currentUser } = useAuthStore();
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingUser, setEditingUser] = useState<UserData | null>(null);

  const isAdmin = currentUser?.role === "ADMIN";

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/users");
      setUsers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Equipo</h1>
          <p className="text-sm text-gray-500">Gestiona los miembros del equipo y sus roles</p>
        </div>
        {isAdmin && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
          >
            <Plus className="h-4 w-4" />
            Nuevo Miembro
          </button>
        )}
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-4">
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-500">Total Miembros</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">{users.length}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-500">Admins</p>
          <p className="mt-1 text-2xl font-bold text-red-600">{users.filter((u) => u.role === "ADMIN").length}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-500">Managers</p>
          <p className="mt-1 text-2xl font-bold text-blue-600">{users.filter((u) => u.role === "MANAGER").length}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-500">Miembros</p>
          <p className="mt-1 text-2xl font-bold text-gray-600">{users.filter((u) => u.role === "MEMBER").length}</p>
        </div>
      </div>

      {loading ? (
        <p className="py-12 text-center text-gray-500">Cargando equipo...</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {users.map((u) => {
            const roleConfig = ROLE_CONFIG[u.role];
            const RoleIcon = roleConfig.icon;
            return (
              <div
                key={u.id}
                className="rounded-xl border border-gray-200 bg-white p-5 transition-shadow hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 text-lg font-semibold text-primary-700">
                      {getInitials(u.name)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{u.name}</h3>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Mail className="h-3 w-3" />
                        {u.email}
                      </div>
                    </div>
                  </div>
                  <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${roleConfig.bg} ${roleConfig.color}`}>
                    <RoleIcon className="h-3 w-3" />
                    {roleConfig.label}
                  </span>
                </div>

                <div className="mt-4 flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1.5 text-gray-500">
                    <div className="h-2 w-2 rounded-full bg-blue-500" />
                    <span>{u._count.assignedDeliveries} entregas activas</span>
                  </div>
                  {u.telegramChatId && (
                    <div className="flex items-center gap-1 text-gray-400">
                      <MessageCircle className="h-3.5 w-3.5" />
                      <span className="text-xs">Telegram</span>
                    </div>
                  )}
                </div>

                {isAdmin && (
                  <div className="mt-4 flex gap-2 border-t border-gray-100 pt-3">
                    <button
                      onClick={() => setEditingUser(u)}
                      className="flex-1 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Editar
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Create User Modal */}
      <CreateUserModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreated={fetchUsers}
      />

      {/* Edit User Modal */}
      {editingUser && (
        <EditUserModal
          open={!!editingUser}
          onClose={() => setEditingUser(null)}
          user={editingUser}
          onUpdated={fetchUsers}
        />
      )}
    </div>
  );
}

function CreateUserModal({ open, onClose, onCreated }: { open: boolean; onClose: () => void; onCreated: () => void }) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "MEMBER" as UserRole, phone: "" });

  const inputClass = "w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/users", form);
      onCreated();
      onClose();
      setForm({ name: "", email: "", password: "", role: "MEMBER", phone: "" });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Nuevo Miembro" size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Nombre</label>
          <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass} placeholder="Nombre completo" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
          <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputClass} placeholder="email@empresa.com" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Contrasena</label>
          <input type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className={inputClass} placeholder="Contrasena inicial" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Rol</label>
            <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as UserRole })} className={inputClass}>
              <option value="MEMBER">Miembro</option>
              <option value="MANAGER">Manager</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Telefono</label>
            <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={inputClass} placeholder="+1234567890" />
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">
          <button type="button" onClick={onClose} className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
            Cancelar
          </button>
          <button type="submit" disabled={loading} className="rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-700 disabled:opacity-50">
            {loading ? "Creando..." : "Crear Miembro"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

function EditUserModal({ open, onClose, user, onUpdated }: { open: boolean; onClose: () => void; user: UserData; onUpdated: () => void }) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: user.name,
    email: user.email,
    role: user.role as UserRole,
    telegramChatId: user.telegramChatId || "",
  });

  const inputClass = "w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put(`/users/${user.id}`, form);
      onUpdated();
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={`Editar: ${user.name}`} size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Nombre</label>
          <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
          <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputClass} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Rol</label>
          <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as UserRole })} className={inputClass}>
            <option value="MEMBER">Miembro</option>
            <option value="MANAGER">Manager</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Telegram Chat ID</label>
          <input value={form.telegramChatId} onChange={(e) => setForm({ ...form, telegramChatId: e.target.value })} className={inputClass} placeholder="Obtener con /id en el bot" />
        </div>

        <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">
          <button type="button" onClick={onClose} className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
            Cancelar
          </button>
          <button type="submit" disabled={loading} className="rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-700 disabled:opacity-50">
            {loading ? "Guardando..." : "Guardar Cambios"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
