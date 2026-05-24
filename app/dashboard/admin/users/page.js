"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { TableRowSkeleton } from "@/components/LoadingSkeleton";
import ConfirmModal from "@/components/ConfirmModal";
import EmptyState from "@/components/EmptyState";
import toast from "react-hot-toast";
import { RiGroupLine, RiDeleteBinLine } from "react-icons/ri";

export default function AdminUsersPage() {
  const { data: session } = useSession();
  const currentUserId = session?.user?.id;
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState(null);

  const fetchUsers = async () => {
    try {
      const res = await fetch(`/api/users?search=${encodeURIComponent(search)}`);
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error("Failed to load users");
    }
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    const delay = setTimeout(() => fetchUsers(), 300);
    return () => clearTimeout(delay);
  }, [search]);

  const handleRoleChange = async (userId, newRole) => {
    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });
      if (res.ok) {
        toast.success("Role updated");
        fetchUsers();
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to update role");
      }
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/users/${deleteId}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("User deleted");
        fetchUsers();
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to delete user");
      }
    } catch (err) {
      toast.error("Something went wrong");
    }
    setDeleteId(null);
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-primary">Manage Users</h1>
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 rounded-xl border border-white/40 bg-white/50 text-primary w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-accent/50 glass-card"
        />
      </div>

      {loading ? (
        <div className="glass-card overflow-hidden">
          <table className="w-full">
            <tbody>
              {[1, 2, 3, 4, 5].map((i) => <TableRowSkeleton key={i} />)}
            </tbody>
          </table>
        </div>
      ) : users.length === 0 ? (
        <EmptyState title="No users found" message="Try a different search term." icon={RiGroupLine} />
      ) : (
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-white/30">
                  <th className="text-left px-5 py-4 text-xs uppercase tracking-wider text-text-secondary font-semibold">User</th>
                  <th className="text-left px-5 py-4 text-xs uppercase tracking-wider text-text-secondary font-semibold">Email</th>
                  <th className="text-left px-5 py-4 text-xs uppercase tracking-wider text-text-secondary font-semibold">Role</th>
                  <th className="text-left px-5 py-4 text-xs uppercase tracking-wider text-text-secondary font-semibold">Joined</th>
                  <th className="text-right px-5 py-4 text-xs uppercase tracking-wider text-text-secondary font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => {
                  const isSelf = user._id === currentUserId;
                  return (
                    <tr key={user._id} className="border-b border-white/20 hover:bg-white/30 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-primary">{user.name}</span>
                          {isSelf && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-accent/15 text-accent uppercase tracking-wide">You</span>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-4 text-primary text-sm">{user.email}</td>
                      <td className="px-5 py-4">
                        {isSelf ? (
                          <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${
                            user.role === "admin" ? "bg-accent/20 text-accent" : "bg-gray-200 text-gray-700"
                          }`}>
                            {user.role === "admin" ? "Admin" : "User"}
                          </span>
                        ) : (
                          <select
                            value={user.role}
                            onChange={(e) => handleRoleChange(user._id, e.target.value)}
                            className={`text-xs font-bold px-3 py-1.5 rounded-full border-0 cursor-pointer ${
                              user.role === "admin" ? "bg-accent/20 text-accent" : "bg-gray-200 text-gray-700"
                            }`}
                          >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                          </select>
                        )}
                      </td>
                      <td className="px-5 py-4 text-sm text-text-secondary">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button
                          onClick={() => !isSelf && setDeleteId(user._id)}
                          disabled={isSelf}
                          title={isSelf ? "You cannot delete your own account" : "Delete user"}
                          className={`p-2 rounded-lg transition-colors ${
                            isSelf
                              ? "text-gray-300 cursor-not-allowed"
                              : "text-text-secondary hover:text-danger hover:bg-danger/10 cursor-pointer"
                          }`}
                        >
                          <RiDeleteBinLine className="text-lg" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete User"
        message="Are you sure you want to delete this user? All their orders will also be deleted."
        confirmText="Delete User"
      />
    </div>
  );
}
