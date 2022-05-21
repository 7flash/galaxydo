import { useState, useEffect } from "preact/hooks";
import { Link, useLocation } from "wouter-preact";
import { useQuery, useMutation } from "@convex/_generated";
import useBus, { dispatch } from "use-bus";
import Input from "@src/shared/Input";

export default function AccountRow() {
    const [location, setLocation] = useLocation();
    const [accountName, setAccountName] = useState("");
    const [accountSignature, setAccountSignature] = useState("");
    const [isEditing, setIsEditing] = useState(false);

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
        console.log("AccountRow.. account", account.name);
        setAccountName(account.name);
        setAccountSignature(account.signature);
    }, []);

    return <div className="flex flex-row justify-start max-w-sm bg-gray-700 p-2">
        <h2 className="mx-2 px-2">Account</h2>
        <div className="mx-2 px-2 bg-gray-600">
            {
                isEditing ? <Input value={accountName} onChange={setAccountName} onSubmit={() => {
                    updateAccountName(accountName, accountSignature);
                    setLocation("/dashboard");
                }} /> : <h2 className="">{accountName || <div className="w-28" />}</h2>
            }
        </div>
        {
            !isEditing && <Link className="underline" href={`/dashboard/editAccountName`}>Change</Link>
        }
        {
            !isEditing && <div>
                <span className="px-2">|</span>
                <Link className="underline" href={`/dashboard/signOut`}>Delete</Link>
            </div>
        }
    </div>
}  