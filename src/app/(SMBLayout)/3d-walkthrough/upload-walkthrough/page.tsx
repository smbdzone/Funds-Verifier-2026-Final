'use client';

import { useState } from 'react';
import { UploadCloud, LinkIcon, File, ImageIcon } from 'lucide-react';

const WalkthroughUpload = () => {
  const [uploadType, setUploadType] = useState<'file' | 'link'>('file');

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg max-w-3xl mx-auto mt-10">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Upload a 3D Walkthrough</h2>

      <form className="space-y-6">
        {/* Property Selection */}
        <div>
          <label className="block text-gray-700 mb-1 font-medium">Property</label>
          <select className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>Select a property</option>
            <option>Luxury Villa</option>
            <option>Sky Towers</option>
          </select>
        </div>

        {/* Title */}
        <div>
          <label className="block text-gray-700 mb-1 font-medium">Title (optional)</label>
          <input
            type="text"
            placeholder="e.g. Living Room Walkthrough"
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Upload Type Toggle */}
        <div>
          <label className="block text-gray-700 mb-1 font-medium">Upload Type</label>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setUploadType('file')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
                uploadType === 'file'
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'border-gray-300 text-gray-700'
              }`}
            >
              <UploadCloud size={18} /> File Upload
            </button>
            <button
              type="button"
              onClick={() => setUploadType('link')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
                uploadType === 'link'
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'border-gray-300 text-gray-700'
              }`}
            >
              <LinkIcon size={18} /> URL Link
            </button>
          </div>
        </div>

        {/* Conditional Input */}
        {uploadType === 'file' ? (
          <div>
            <label className="block text-gray-700 mb-1 font-medium">Walkthrough File</label>
            <div className="border border-dashed border-gray-400 rounded-lg p-4 flex items-center gap-2 bg-gray-50">
              <File size={20} />
              <input type="file" accept="video/*" className="w-full bg-transparent" />
            </div>
          </div>
        ) : (
          <div>
            <label className="block text-gray-700 mb-1 font-medium">Walkthrough Link</label>
            <input
              type="url"
              placeholder="https://example.com/your-walkthrough"
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}

        {/* Thumbnail Upload */}
        <div>
          <label className="block text-gray-700 mb-1 font-medium">Thumbnail Image (optional)</label>
          <div className="border border-dashed border-gray-400 rounded-lg p-4 flex items-center gap-2 bg-gray-50">
            <ImageIcon size={20} />
            <input type="file" accept="image/*" className="w-full bg-transparent" />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-gray-700 mb-1 font-medium">Description (optional)</label>
          <textarea
            placeholder="Brief description of this walkthrough"
            rows={3}
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-3">
          <button
            type="reset"
            className="px-4 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700"
          >
            Upload Walkthrough
          </button>
        </div>
      </form>
    </div>
  );
};

export default WalkthroughUpload;
