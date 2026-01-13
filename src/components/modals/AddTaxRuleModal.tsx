import { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
interface AddTaxRuleModalProps {
  isOpen: boolean;
  onClose: () => void;
}
export function AddTaxRuleModal({
  isOpen,
  onClose
}: AddTaxRuleModalProps) {
  const [state, setState] = useState('Alabama');
  return <Modal isOpen={isOpen} onClose={onClose} title="Add New Tax Rule">
    <form className="space-y-4" onSubmit={e => {
      e.preventDefault();
      onClose();
    }}>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          State
        </label>
        <Select
          className="w-full"
          placeholder="Select a State"
          options={[
            { label: 'Alabama', value: 'Alabama' },
            { label: 'Alaska', value: 'Alaska' },
            { label: 'Arizona', value: 'Arizona' },
          ]}
          value={state}
          onChange={setState}
        />
      </div>

      <Input label="Tax Rate (%)" placeholder="e.g. 8.25" type="number" step="0.01" />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Status
        </label>
        <div className="flex gap-4 mt-2">
          <label className="flex items-center gap-2">
            <input type="radio" name="status" defaultChecked className="text-[#FF6B35] focus:ring-[#FF6B35]" />
            <span className="text-sm text-gray-700">Active</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="radio" name="status" className="text-[#FF6B35] focus:ring-[#FF6B35]" />
            <span className="text-sm text-gray-700">Inactive</span>
          </label>
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-6">
        <Button type="button" variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">Add Rule</Button>
      </div>
    </form>
  </Modal>;
}