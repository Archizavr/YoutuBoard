import { User } from "lucide-react";

export default function ProfilePage () {
    return (
        <div className="text-center py-20">
        <User className="w-16 h-16 text-blue-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-slate-700 mb-2">Profile</h2>
        <p className="text-slate-700">Profile settings</p>
        </div>
    );
}