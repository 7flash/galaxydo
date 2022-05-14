import { useEffect } from "preact/hooks";
import { useLocation, Link } from "wouter-preact";
import { sign } from "web3-token";
import { dispatch } from "use-bus";
import { ethers } from "ethers";

// TODO: make a lottery where participants are joined into groups..
// those groups agree on the number consensys
// and one of the numbers is winner.. the group is rewarded..
// or you join with one of groups.. a group for each number..
// and the one number is rewarded.. distributed reward with participants..

export default function ConnectPage() {
    const [location,] = useLocation();

    useEffect(() => {
        console.log("DefaultPage.. first", location);
        void async function () {
            console.log("DefaultPage.. second", location);
            if (location.indexOf('/signDevice') != -1) {
                const response = await fetch("/api/connectWithDevice", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                const data = await response.json();
                dispatch({
                    type: "authSignature",
                    payload: data.authToken,
                });
            } else if (location.indexOf('/signMetamask') != -1) {
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const signer = provider.getSigner();
                const signature = await sign(
                    async msg => await signer.signMessage(msg),
                    '1d'
                );
                console.log({ signature });
                const response = await fetch("/api/connectWithMetamask", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        signature
                    }),
                });
                const data = await response.json();
                console.log({ data });
                dispatch({
                    type: "authSignature",
                    payload: data.authToken,
                })
            }
        }();
    }, [location]);

    return <div className="m-8">
        <h2>Authorized account required</h2>
        {
            location.indexOf('/signMetamask') != -1 ?
                <h2>Metamask Signing.. Confirm in popup..</h2> :
                <div className="flex flex-col">
                    <Link className="underline" href={`/connect/signDevice`}>Sign this Device</Link>
                    {/* <Link className="underline" href={`/connect/signMetamask`}>Sign with Metamask</Link>                 */}
                </div>
        }
    </div>
}