import UserMenu from '../components/UserMenu'
import { Outlet } from 'react-router-dom'

const Dashboard = () => {
  return (
    <section>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 lg:shadow-md lg:flex relative gap-6">
        
        {/* Left Sidebar (Fixed, Scrollable, Does Not Go Under Header) */}
        <div className="w-[250px] py-4 lg:h-[calc(100vh-80px)] sticky top-[80px] overflow-y-auto hidden lg:block border-r border-gray-200 bg-white">
          <UserMenu />
        </div>

        {/* Right Content */}
        <div className="flex-1 min-h-[50vh] p-4">
          <Outlet />
        </div>

      </div>
    </section>
  )
}

export default Dashboard
