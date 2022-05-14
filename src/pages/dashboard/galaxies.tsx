import { useState, useEffect } from "preact/hooks";
import { useLocation } from "wouter-preact";
import { useQuery, useMutation } from "@convex/_generated";
import useBus from "use-bus";
import { Link } from "wouter-preact";
import Input from "@src/shared/Input";

export default function Galaxies() {
    const [isEditing, setIsEditing] = useState(false);
    const [proposalText, setProposalText] = useState(null);
    const [accountName, setAccountName] = useState("Me");
    const [accountSignature, setAccountSignature] = useState("");
    const [totalProposals, setTotalProposals] = useState(0);
    const [consensysProposals, setConsensysProposals] = useState(0);
    const [location, setLocation] = useLocation();

    useBus("account", ({ payload: account }) => {
        setAccountName(account.name);
        setAccountSignature(account.signature);
    }, []);

    const denyProposal = useMutation("userDenyProposal");
    const executeProposal = useMutation("userExecuteProposal");

    useEffect(() => {
        const route = location.split('/')[2];
        if (route == "denyProposal") {
            const proposalId = location.split('/')[3];
            denyProposal(proposalId, accountSignature)
            setLocation("/dashboard");
        } else if (route == "editProposal") {
            const newProposalText = location.split('/')[3];
            if (newProposalText) {
                // setProposalText(newProposalText);
                proposeGalaxy(newProposalText, accountSignature);
                setLocation("/dashboard");
            } else {
                setIsEditing(true);
            }
        } else if (route == "executeProposal") {
            executeProposal(accountSignature);
            setLocation("/dashboard");
        } else {
            setIsEditing(false);
        }
    }, [location]);

    const currentProposal = useQuery("getUserCurrentProposal", accountSignature) || {};
    const proposedGalaxies = useQuery("getProposedGalaxies", accountSignature) || [];
    const galaxiesHistory = useQuery("getGalaxiesHistory") || [];
    const proposerUsers = useQuery("getProposerUsers", accountSignature) || [];

    const proposalStats = useQuery("getProposalStats", accountSignature) || {};

    useEffect(() => {
        if (proposalStats) {
            setTotalProposals(proposalStats.totalNumber);
            setConsensysProposals(proposalStats.consensysNumber);    
        }
    }, [proposalStats]);

    useEffect(() => {
        console.log("Galaxies.. currentProposal", currentProposal);
        setProposalText(currentProposal.name);
    }, [currentProposal]);

    const proposeGalaxy = useMutation("userProposeGalaxy");

    const createUniverse = useMutation("userCreateUniverse");

    const completedMeeting = galaxiesHistory.length == 6;

    return <div className="flex flex-col mt-4">

        <div className="flex flex-row">
            <h2 className="text-xl px-2">Consensys</h2>
            {
                totalProposals > 0 &&
                    <h2 className="text-sm">{consensysProposals} of {totalProposals} agreed with {accountName}</h2>
            }
            {
                totalProposals > 0 && consensysProposals == totalProposals &&
                <Link className="px-2 underline text-sm" href={`/dashboard/executeProposal`}>Execute</Link>
            }
        </div>
        <div className="bg-gray-700 p-2 my-2 flex flex-row">
            <div className="flex flex-row mx-2">
                <h2 className="bg-gray-600 mr-2 px-2">{accountName || <div className="w-28">My account</div>}</h2>
                <h2 className="mr-2">votes for</h2>
                {/* {
                    isEditing && <Input value={proposalText} onChange={setProposalText} onSubmit={(value) => {
                        console.log("proposalText", value);
                        proposeGalaxy(value, accountSignature);
                        setLocation("/dashboard");
                    }} />
                } */}

                {
                    isEditing && <div>
                        <div class="p-2">
                            <div class="dropdown inline-block relative">
                            <button class="bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded inline-flex items-center">
                                <span class="mr-1">{proposalText}</span>
                                <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/> </svg>
                            </button>
                            <ul class="dropdown-menu absolute hidden text-gray-700 pt-1">
                                {/* <li class=""><Link class="rounded-t bg-gray-200 hover:bg-gray-400 py-2 px-4 block whitespace-no-wrap" href={`
                                    /dashboard/editProposal/first
                                `}>One</Link></li> */}
                                {
                                    proposerUsers.filter(user => user && user.name).map(user => <li class=""><Link class="bg-gray-200 hover:bg-gray-400 py-2 px-4 block whitespace-no-wrap" href={`
                                            /dashboard/editProposal/${user.name}
                                        `}>{user.name}</Link></li>
                                    )
                                }
                                {/* <li class=""><Link class="rounded-b bg-gray-200 hover:bg-gray-400 py-2 px-4 block whitespace-no-wrap" href={`
                                    /dashboard/editProposal/third
                                `}>Three</Link></li> */}
                            </ul>
                            </div>
                        </div>
                    </div>
                }

                {
                    !isEditing && <div className="flex flex-row">
                        <h2 className="bg-gray-600 ml-2 px-2">{proposalText || <div className="w-28"></div>}</h2>
                        <Link href="/dashboard/editProposal" className="px-2 underline">Choose</Link>
                    </div>
                }
            </div>
        </div>
        {proposedGalaxies.map((galaxy) => {
                return <div className="flex flex-col">
                    <div className="flex flex-row my-2 p-2 bg-gray-700">
                        <h2 className="bg-gray-600 mr-2 px-2">{galaxy.accountName}</h2>
                        <h2 className="mr-2">votes for</h2>
                        <h2 className="bg-gray-600 ml-2 px-2">{galaxy.name}</h2>
                        <Link href={`/dashboard/denyProposal/${galaxy._id}`} className="px-2 underline">Deny</Link>
                    </div>
                </div>
        })}
        <div className="">
            <h2 className="text-xl px-2">Ranking</h2>
            <div className="flex flex-col">
                {
                    galaxiesHistory.map((galaxy, i) => {
                        return <div className="flex flex-row my-2 p-2 bg-gray-700">
                            {/* <h2 className="bg-gray-600 mr-2 px-2">{galaxy.accountName}</h2>
                            <h2 className="mr-2">created </h2> */}
                            <h2 className="bg-gray-600 ml-2 px-2">{galaxy.name}</h2>
                            <h2 className="ml-2">is {i+1}th ({6-i} reputation)</h2>
                        </div>
                    })
                }                
            </div>
        </div>
    </div>
}

// export default function Galaxies() {
//     const [location, setLocation] = useLocation();
//     const [authSignature, setAuthSignature] = useState(null);
//     const [isEditing, setIsEditing] = useState(false);

//     // const createGalaxy = useMutation("userCreateGalaxy");
//     const proposeGalaxy = useMutation("userProposeGalaxy");
//     // const myGalaxies = useQuery("getMyGalaxies", authSignature) || [];
//     const proposedGalaxies = useQuery("getProposedGalaxies") || [];

//     useEffect(() => {
//         const authSignature = window.localStorage.getItem("authSignature");
//         if (authSignature) {
//             setAuthSignature(authSignature);
//         }
//     }, []);

//     useEffect(() => {
//         if (location.split('/')[2] == "createGalaxy") {
//             setIsEditing(true);
//         } else {
//             setIsEditing(false);
//         }
//     }, [location]);

//     console.log("Galaxies..")

//     return <div className="flex flex-col my-2">
//         <h2 className="">Consensys</h2>
//         <div className="flex flex-col">
//             <div className="flex flex-row justify-start max-w-sm bg-gray-700 p-2">
//                 <h2 className="">Proposal by {}</h2>
//             </div>
//         </div>
//         <div className="flex flex-col">
//             <div className="bg-gray-700 p-2 my-2 flex flex-row">
//                 <h2 className="mr-4 bg-gray-600 px-2">0/5 consensys</h2>
//                 <h2 className="text-sm">all should be the same</h2>
//             </div>
//             <Link className="underline" href="/dashboard/proposeGalaxy">Propose Galaxy</Link>
//             {
//                 proposedGalaxies.map((galaxy, index) => {
//                     return <div className="bg-gray-700 p-2 my-2 flex flex-row">
//                         <h2 className="mr-4 bg-gray-600 px-2">{galaxy.name}</h2>
//                         <h2 className="text-sm">by {galaxy.accountName}</h2>
//                     </div>
//                 })
//             }
//         </div>
//         <div className="flex flex-row">
//             <h2 className="mr-4">Past Galaxies</h2>
//         </div> */}
//         {/* <div className="bg-gray-700 p-2 my-2">
//             {
//                 isEditing ? <div className="flex flex-row">
//                     <Input value={""} onChange={() => {}} onSubmit={(value: string) => {
//                         createGalaxy(value, authSignature);
//                         setLocation("/dashboard");
//                     }} />
//                     <h3 className="ml-4 text-sm">enter galaxy name</h3>
//                 </div> : <div className="flex flex-row">
//                    <h2 className="mr-4 bg-gray-600 px-2">{myGalaxies.length} galaxies created</h2>
//                    <Link className="underline" href={`/dashboard/createGalaxy`}>Create now</Link>
//                 </div>
//             }
//         </div>
//     </div>
// }