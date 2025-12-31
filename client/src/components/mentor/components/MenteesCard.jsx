export default function MenteesCard({ mentees = [] }) {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-2xl transition duration-300 hover:shadow-indigo-500/30 border border-gray-100 dark:border-gray-700">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center">
        Your Active Mentees <span className="ml-2 text-3xl">🧑‍💻</span>
      </h2>
      <ul className="space-y-4">
        {mentees.length === 0 ? (
          <li className="text-gray-500 dark:text-gray-400">No active mentees yet.</li>
        ) : (
          mentees.map(mentee => (
            <li key={mentee.mentee_id} className="flex justify-between items-center p-4 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 transition duration-150 hover:bg-indigo-50 dark:hover:bg-gray-600 cursor-pointer">
              <span className="text-lg font-medium text-gray-800 dark:text-gray-100">
                {mentee.name || mentee.username || 'Unknown Mentee'}
              </span>
              <span className="text-sm font-semibold text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/50 px-3 py-1 rounded-full capitalize">
                {mentee.status}
              </span>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}