import { useQuery } from "@convex/_generated";
import { useEffect, useState } from "preact/hooks";
import Input from "@src/shared/Input";
import { useLocation, Link } from "wouter-preact";

export default function TestPage() {
    const [inputValue, setInputValue] = useState("");
    const [accountId, setAccountId] = useState(null);
    const [location, setLocation] = useLocation();
    const [fractalId, setFractalId] = useState("");

    useEffect(() => {
        const fractalIdParam = location.split("/")[3];

        if (fractalIdParam) {
            setFractalId(fractalIdParam);
        }
    }, []);

    const fractalData = useQuery("getFractal", fractalId);

    // when going to another group - automatically exit current one
    // when going by link..
    // by default create a new group..
    // never really exit the group.. rather just change the active one..
    // only one active group at the moment.. where you participate..
    // when going to another group.. your proposal is removed..
    // but you can still remain an admin..
    
    // automatically remove member.. when proposal is removed..
    // he needs to make proposal again.. then he is visible..
    // only those who have proposal.. they are members..
    // can we use account name as authentication.. no keep ip..
    // but dont show ip..

    // only admin can deny/kick
    // once required number of members joined.. voting begins.. automatically..

    // using authorization header.. instead of passing auth signature in each query..
    // assign did instead of random bytes..

    // votes collection = voter account ID + voting for account ID
    // it solves current bug.. when account name changed..
    // should be changed all votes..
    // account scoped by fractal.. default accounts collection..
    // should not affect previously created fractals..
    // but affect current one.. when changing account name..

    // dropbox for each section - to hide and focus..
    // when open one section - close others..

    // Account @berliangor [Change]

    // Fractal @may14th [Details]

    // Consensys on #1.. [Choose] (commit-reveal)

    // Ranking final..

    // Ranking [1st is ..]

    // new feature is filtering by fractal.. both members and votes..

    // NO INVITE LINKS

    // Instead.. choose your group.. and have joined it..

    // No admins..

     // no invite links.. everyone chosen the same group name..

     // get assigned to the same room..

     // everyone is an admin..

     // no assignment to room.. just choose filter..
     // which fractal to show..
     // can participate multiple..
     // with the same account..

     // when user switch to another fractal - remove his proposal from current
     // and put his proposal into new fractal
     // proposal and member is the same then..
     // do we need table of fractals..
     // or can join any fractal at all..

    return <div>
        <h2>Account @berliangor</h2>
        <h2>Fractal "21 May, Group 3" // Change</h2>
    </div>

    return <div className="">
        <h2 className="">Fractal group</h2>
        <div>
            <h2 className="">Name is not defined [Change]</h2>
            <h2 className="">Creator is my account</h2>
            <h2 className="">Members required are 6 [Change]</h2>
            <h2 className="">Consensys required of 5 [Change]</h2>
            <h2 className="">Members joined are [Invite]</h2>
            <h2 className="">Fractal status is waiting/voting/finalized</h2>
        </div>
        <div className="flex flex-col">
            <h2 className="">Consensys</h2>
            <div className="flex flex-col">

            </div>
        </div>
        <div className="flex flex-col">
            <h2 className="">Ranking</h2>
            <div className="flex flex-col">

            </div>
        </div>
    </div>

    return <div className="m-8">
        <div className="flex flex-col mt-4">
            <div className="flex flex-row">
                <h2 className="text-xl px-2">Fractal group</h2>
                <Link className="ml-2 text-sm underline"
                    href="/fractals/exit"
                >exit now</Link>
            </div>
            <div className="flex flex-row bg-gray-700 p-2 my-2">
                <div className="flex flex-col mx-2">
                    h2.bg-gray-600.mr-2.px-2
            </div>
        </div>
    </div>

    const account = useQuery("getAccountBySignature", inputValue) || {};

    useEffect(() => {
        console.log("TestPage.. account", account);
        if (account._id) {
            setAccountId(account._id.toString());
        }
    }, [account]);

    return <div className="m-8">
        <h1 className="text-xl">Fractals</h1>
        <h2 className="text-xl">{accountId}</h2>
        <Input value={inputValue} onChange={setInputValue} onSubmit={(value) => {
            console.log("inputValue", value);
        }} />
    </div>;
}