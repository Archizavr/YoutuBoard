import { useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  const navigate = useNavigate();

  const goToLogin = () => {
    navigate('/auth/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center text-center">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-5xl font-bold text-gray-900 md:text-6xl">
          Welcome to <span className="text-primary">YoutuBoard</span>!
        </h1>
        <p className="mt-4 text-lg text-gray-600 md:text-xl">
          The best place to visualize your YouTube channel's statistics in an easy and intuitive way.
        </p>
        <div className="mt-8">
          <Button onClick={goToLogin} size="lg">
            Get Started Now
          </Button>
        </div>

        <div className="mt-20 grid md:grid-cols-3 gap-8">
          <div className="p-6 border rounded-lg">
            <h3 className="text-xl font-semibold text-gray-900">Analytics</h3>
            <p className="mt-2 text-gray-600">
              Deep dive into your channel's performance with detailed analytics.
            </p>
          </div>
          <div className="p-6 border rounded-lg">
            <h3 className="text-xl font-semibold text-gray-900">Reports</h3>
            <p className="mt-2 text-gray-600">
              Generate and export custom reports to track your growth.
            </p>
          </div>
          <div className="p-6 border rounded-lg">
            <h3 className="text-xl font-semibold text-gray-900">Dashboard</h3>
            <p className="mt-2 text-gray-600">
              A beautiful and intuitive dashboard to see all your key metrics at a glance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}