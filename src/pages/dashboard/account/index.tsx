import { useState, useEffect } from "preact/hooks";
import { Link, useLocation } from "wouter-preact";
import { useQuery, useMutation } from "@convex/_generated";
import useBus, { dispatch } from "use-bus";
import Input from "@src/shared/Input";
import AccountRow from "./accountRow";
import RoomRow from "./roomRow";

export default function Account() {
    const [location, setLocation] = useLocation();
    const [fractalName, setFractalName] = useState(null);
    const [accountName, setAccountName] = useState(null);
    const [accountAddress, setAccountAddress] = useState(null);
    const [accountSignature, setAccountSignature] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    console.log("DashboardPage..");

    const updateAccountName = useMutation("userUpdateAccountName");

    useEffect(() => {
        console.log("DashboardPage.. location", location);

        if (location.split('/')[2] == "signOut") {
            dispatch({
                type: "authSignature",
                payload: "",
            });
        }

        if (location.split('/')[2] == "editAccountName") {
            setIsEditing(true);
        } else {
            setIsEditing(false);
        }
    }, [location]);

    useBus("account", ({ payload: account }) => {
        console.log("Account.. account", account.name);
        console.log("account name", account.name);
        setAccountName(account.name);
        setAccountAddress(account.address);
        setAccountSignature(account.signature);
    }, []);

    return <div className="flex flex-col">
        <div className="flex flex-row mb-2">
            <h2 className="text-xl px-2">Fractal Genesis, May 21th</h2>
            {/* <Link className="underline text-sm" href={`/dashboard/signOut`}>Logout</Link> */}
        </div>
        {/* <div className="bg-gray-700 p-2 my-2 flex flex-row">
            <h2 className="mx-2 px-2">Address</h2>
            <div className="mx-2 px-2 bg-gray-600">
                <h2 className="">{accountAddress || <div className="w-72" />}</h2>
            </div>
        </div> */}
        <AccountRow />
        <RoomRow />
    </div>
}  