interface ProfileActionButtonsProps {
  loading: boolean;
  onCancel: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const ProfileActionButtons = ({ loading, onCancel, onSubmit }: ProfileActionButtonsProps) => (
  <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-6">
    <button
      type="button"
      onClick={onCancel}
      className="w-full sm:w-auto px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-all duration-200"
    >
      Cancel
    </button>
    <button
      type="submit"
      disabled={loading}
      onClick={onSubmit}
      className="w-full sm:w-auto px-6 py-3 border  border-gray-300  rounded-lg text-gray-700   font-medium hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 "
    >
      {loading ? (
        <>
          <div className="w-full sm:w-auto px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"></div>
          Saving...
        </>
      ) : (
        'Save Changes'
      )}
    </button>
  </div>
);
