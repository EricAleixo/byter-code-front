import { getCurrentUser } from "@/src/utils/getCurrentUser";
import { notFound} from "next/navigation";
import { ReactNode } from "react";

export default async function Layout({children}: {children: ReactNode}) {
    const user = await getCurrentUser();
    if(!(user?.role === "ADMIN")) notFound();
    return(
        <>
            {children}
        </>
    )
}