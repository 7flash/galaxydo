import { useQuery } from "@convex/_generated";
import { useEffect, useState } from "preact/hooks";
import Input from "@src/shared/Input";

export default function TestPage() {
    const [inputValue, setInputValue] = useState("");
    const [accountId, setAccountId] = useState(null);

    const account = useQuery("getAccountBySignature", inputValue) || {};

    useEffect(() => {
        console.log("TestPage.. account", account);
        if (account._id) {
            setAccountId(account._id.toString());
        }
    }, [account]);

    return <div className="m-8">
        <h1 className="text-xl">Account ID</h1>
        <h2 className="text-xl">{accountId}</h2>
        <Input value={inputValue} onChange={setInputValue} onSubmit={(value) => {
            console.log("inputValue", value);
        }} />
    </div>;
}