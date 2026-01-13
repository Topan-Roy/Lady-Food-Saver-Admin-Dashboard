import { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
interface EditTaxRuleModalProps {
  isOpen: boolean;
  onClose: () => void;
  rule: any;
}
export function EditTaxRuleModal({
  isOpen,
  onClose,
  rule
}: EditTaxRuleModalProps) {
  const [status, setStatus] = useState(rule.status);
  if (!rule) return null;
  return <Modal isOpen={isOpen} onClose={onClose} title={`Edit Tax Rule - ${rule.state}`}>
    <form className="space-y-4" onSubmit={e => {
      e.preventDefault();
      onClose();
    }}>
      <Input label="Tax Rate (%)" defaultValue={rule.rate.replace('%', '')} type="number" step="0.01" />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Status
        </label>
        <Select
          className="w-full"
          options={[
            { label: 'Active', value: 'Active' },
            { label: 'Inactive', value: 'Inactive' },
          ]}
          value={status}
          onChange={setStatus}
        />
      </div>

      <div className="flex justify-end gap-3 mt-6">
        <Button type="button" variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">Save Changes</Button>
      </div>
    </form>
  </Modal>;
}