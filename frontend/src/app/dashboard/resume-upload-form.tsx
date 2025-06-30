'use client';

import { MultiSelect } from '@/components/ui/mutli-select';
import { useEffect, useState } from 'react';
import jobRoles from '../../../public/job_roles.json';

export function getJobRoleOptions() {
    const options: { value: string; label: string }[] = [];
    Object.keys(jobRoles).forEach((category) => {
        const roles = (jobRoles as Record<string, string[]>)[category];
        options.push(...roles.map((role: string) => ({ value: role, label: role })));
    });
    return options;
}

export default function ResumeUploadForm() {
  const [location, setLocation] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [data, setData] = useState<any>(null);
  const jobRoleOptions = getJobRoleOptions();
  const [selectedJobRoles, setSelectedJobRoles] = useState<string[]>([]);

  useEffect(() => {
    console.log(data);
  }, [data]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(false);
    setError('');
    const formData = new FormData();
    if (file) formData.append('resume', file);
    formData.append('desired_role', selectedJobRoles.join(', '));
    try {
      const res = await fetch('http://localhost:8000/upload-resume', {
        method: 'POST',
        body: formData,
      });
      if (res.ok) {
        setData( await res.json());
        setSuccess(true);
        setFile(null);
        setSelectedJobRoles([]);
        setLocation
      } else {
        const data = await res.json();
        setError(data.detail || 'Submission failed.');
      }
    } catch (err) {
      setError('Network error.');
    }
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div
        className={`border-2 border-dashed rounded p-6 text-center cursor-pointer transition-colors ${dragActive ? 'border-blue-500' : 'border-gray-300'}`}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={() => document.getElementById('resume-upload-input')?.click()}
        >
        <input
          id="resume-upload-input"
          type="file"
          accept=".pdf,.doc,.docx"
          style={{ display: 'none' }}
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          required
        />
        {file ? (
          <div className="mt-2">
            <span className="font-semibold text-blue-700 bg-blue-100 px-2 py-1 rounded">
              {file.name}
            </span>
          </div>
        ) : (
          <span className="text-gray-500">Drag and drop your resume here or click to upload</span>
        )}
      </div>
          <div className="w-full max-w-xl mb-6">
              <MultiSelect
                  options={jobRoleOptions}
                  selected={selectedJobRoles}
                  onChange={setSelectedJobRoles}
                  placeholder="Select job roles..."
                  emptyText="No job roles found."
              />
          </div>
      
      <input
        type="text"
        placeholder="Location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        className="border p-2 rounded w-full"
      />
      <button type="submit" className="bg-blue-600 text-white p-2 rounded">Submit</button>
      {success && <p className="text-green-600 mt-2">Successfully Submitted</p>}
      {error && <p className="text-red-600 mt-2">{error}</p>}
    </form>
  );
}
