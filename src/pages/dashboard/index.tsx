import Account from "./account";
import Galaxies from "./galaxies";
import { useQuery } from "@convex/_generated";
import { useState, useEffect } from "preact/hooks";
import { dispatch } from "use-bus";

export default function DashboardPage() {
    const [authSignature, setAuthSignature] = useState(null);

    const account = useQuery("getAccountBySignature", authSignature) || {};

    useEffect(() => {
        const authSignature = window.localStorage.getItem("authSignature");
        console.log({ authSignature })
        if (authSignature) {
            setAuthSignature(authSignature);
        }
    }, []);

    useEffect(() => {
        console.log("DashboardPage.. account", account);

        if (account._id) {
            dispatch({
                type: "account",
                payload: account,
            })

            // if (account.signature != authSignature) {
            //     window.localStorage.setItem("authSignature", account.signature);
            //     setAuthSignature(account.signature);
            // }
        }
    }, [account]);

    return <div className="m-8">
        <Account />
        <Galaxies />
    </div>
}