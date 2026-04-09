import { getCurrentUser } from "@/src/utils/getCurrentUser";
import EditProfilePage from "./_components/EditProfilePage";
import { redirect } from "next/navigation";

export default async function Page(){

    const user = await getCurrentUser();
    if(!user) redirect("/auth/login");

    return <EditProfilePage user={user}/>
}