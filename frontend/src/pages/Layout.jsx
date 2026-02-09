import { useState, useEffect, useMemo } from 'react'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import { Outlet } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { loadTheme } from '../features/themeSlice'
import { Loader2Icon } from 'lucide-react'
import { useUser, SignIn, useAuth, CreateOrganization, useOrganizationList } from '@clerk/clerk-react'
import { fetchWorkspaces } from '../features/workspaceSlice'

const Layout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const { loading: workspaceLoading, workspaces } = useSelector((state) => state.workspace)
    const dispatch = useDispatch()
    const { user, isLoaded: isUserLoaded } = useUser()
    const { getToken } = useAuth()

    // ✅ Memberships ko explicitly fetch karne ke liye
    const { isLoaded: isOrgLoaded, userMemberships, setActive } = useOrganizationList({
        userMemberships: { infinite: true }
    });

    // ✅ Memoize organizationList taaki loop na bane
    const organizationList = useMemo(() => {
        return userMemberships?.data?.map((m) => m.organization) || [];
    }, [userMemberships?.data]);

    const [isSyncing, setIsSyncing] = useState(true);

    useEffect(() => {
        dispatch(loadTheme())
    }, [dispatch])

    useEffect(() => {
        const syncData = async () => {
            // Jab tak Clerk load na ho jaye, kuch mat karo
            if (!isUserLoaded || !isOrgLoaded || userMemberships.isLoading || !user) return;

            console.log("DEBUG: Syncing data for", user.primaryEmailAddress?.emailAddress);

            // 1. Agar user ke paas org hai par active nahi hai, toh active set karo
            if (organizationList.length > 0 && !setActive.id) {
                console.log("DEBUG: Setting Active Organization...");
                try {
                    // Yahan await lagana zaroori hai
                    await setActive({ organization: organizationList[0].id });
                } catch (e) {
                    console.error("DEBUG: setActive Error:", e);
                }
            }

            // 2. Fetch Workspaces (Sirf ek baar jab array empty ho)
            if (workspaces.length === 0 && !workspaceLoading) {
                console.log("DEBUG: Fetching Workspaces...");
                const token = await getToken();
                dispatch(fetchWorkspaces(token));
            }

            setIsSyncing(false);
        };

        syncData();
        // Dependency array ko clean rakha hai loop rokne ke liye
    }, [isUserLoaded, isOrgLoaded, userMemberships.isLoading, organizationList.length, setActive]);

    // --- Loading Screen ---
    if (!isUserLoaded || !isOrgLoaded || (isOrgLoaded && userMemberships.isLoading) || isSyncing) {
        return (
            <div className='flex items-center justify-center h-screen bg-white dark:bg-zinc-950'>
                <Loader2Icon className="size-7 text-blue-500 animate-spin" />
            </div>
        )
    }

    if (!user) return <div className='flex justify-center items-center h-screen'><SignIn /></div>

    // --- Final Redirection Logic ---
    const hasOrgs = organizationList.length > 0;
    const hasWorkspaces = workspaces.length > 0;

    if (!hasOrgs && !hasWorkspaces && !workspaceLoading) {
        return (
            <div className='flex justify-center items-center min-h-screen bg-white dark:bg-zinc-950'>
                <CreateOrganization />
            </div>
        )
    }

    return (
        <div className="flex bg-white dark:bg-zinc-950 text-gray-900 dark:text-slate-100">
            <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
            <div className="flex-1 flex flex-col h-screen">
                <Navbar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
                <div className="flex-1 h-full p-6 xl:p-10 xl:px-16 overflow-y-scroll">
                    <Outlet />
                </div>
            </div>
        </div>
    )
}

export default Layout
