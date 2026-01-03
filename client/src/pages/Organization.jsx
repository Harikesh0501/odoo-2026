import React, { useEffect, useState } from 'react';
import hrApi from '../utils/hrApi';

const Organization = () => {
  const [orgs, setOrgs] = useState([]);
  const [form, setForm] = useState({ name: '', address: '', departments: '' });

  const load = async () => {
    try {
      const data = await hrApi.getOrganizations();
      setOrgs(data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...form, departments: form.departments.split(',').map(s => s.trim()).filter(Boolean) };
      await hrApi.createOrganization(payload);
      setForm({ name: '', address: '', departments: '' });
      load();
    } catch (err) { console.error(err); }
  };

  const remove = async (id) => {
    if (!confirm('Delete organization?')) return;
    await hrApi.deleteOrganization(id);
    load();
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Organization</h2>

      <form onSubmit={submit} className="mb-6 max-w-md">
        <div className="mb-2">
          <label className="block text-sm">Name</label>
          <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full" />
        </div>
        <div className="mb-2">
          <label className="block text-sm">Address</label>
          <input value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} className="w-full" />
        </div>
        <div className="mb-2">
          <label className="block text-sm">Departments (comma separated)</label>
          <input value={form.departments} onChange={e => setForm({ ...form, departments: e.target.value })} className="w-full" />
        </div>
        <button className="btn-primary px-4 py-2 rounded">Save Organization</button>
      </form>

      <div>
        <h3 className="font-medium mb-2">Organizations</h3>
        <ul className="space-y-2">
          {orgs.map(o => (
            <li key={o._id} className="p-3 border rounded flex justify-between items-center">
              <div>
                <div className="font-semibold">{o.name}</div>
                <div className="text-sm text-secondary">{o.address}</div>
                <div className="text-sm mt-1">{(o.departments || []).join(', ')}</div>
              </div>
              <div>
                <button onClick={() => remove(o._id)} className="text-red-600 text-sm">Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Organization;
