import { ProgressBar } from "./ProgressBar"

export const Loader = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="text-center space-y-4">
                <div className="text-xl font-semibold text-gray-700">Loading...</div>
                <ProgressBar />
            </div>
        </div>
   )
}