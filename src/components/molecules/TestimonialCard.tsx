import { FC } from "react";

interface TestimonialCardProps {
  name: string;
  role?: string;
  text: string;
  avatar?: string;
}

const TestimonialCard: FC<TestimonialCardProps> = ({ name, role, text, avatar }) => (
  <div className="bg-white dark:bg-slate-900 rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 flex flex-col items-center text-center border border-gray-100 dark:border-slate-800">
    {avatar ? (
      <img src={avatar} alt={name} className="w-14 h-14 rounded-full mb-3 object-cover" />
    ) : (
      <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center mb-3 text-2xl font-bold text-emerald-700 dark:text-emerald-300">
        {name[0]}
      </div>
    )}
    <p className="text-gray-700 dark:text-gray-200 italic mb-3">“{text}”</p>
    <div className="font-semibold text-emerald-700 dark:text-emerald-300">{name}</div>
    {role && <div className="text-xs text-gray-400 mt-1">{role}</div>}
  </div>
);

export default TestimonialCard; 