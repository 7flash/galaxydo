import { useState, useEffect } from "preact/hooks";
import { Link, useLocation } from "wouter-preact";
import { useQuery, useMutation } from "@convex/_generated";
import useBus, { dispatch } from "use-bus";
import Input from "@src/shared/Input";
import AccountRow from "./accountRow";

export default function RoomRow() {
    const [location, setLocation] = useLocation();
    // const [fractalName, setFractalName] = useState(null);
    const [accountName, setAccountName] = useState(null);
    const [accountAddress, setAccountAddress] = useState(null);
    const [accountSignature, setAccountSignature] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [isChoosing, setIsChoosing] = useState(false);
    const [roomName, setRoomName] = useState("");
    const [accountRoomId, setAccountRoomId] = useState("");

    console.log("DashboardPage..");

    // const updateAccountName = useMutation("userUpdateAccountName");

    // todo: currently chosen by user to participate.. associated with account..
    // discord style.. joining a server of the organization.. each organization is a fractal
    const fractalName = 'general';

    const fractalRooms = useQuery("getFractalRooms", fractalName);
    const currentRoom = useQuery("getRoomById", accountRoomId);

    // dispatch when room changed.. ?? no.. just real time query should be enough..
    // once account room changed.. expected to automatically refresh its consensys on page..

    const createRoom = useMutation("userCreateRoom");
    const joinRoom = useMutation("userJoinRoom");

    useEffect(() => {
        console.log('fractal rooms', fractalRooms);
    }, [fractalRooms]);

    useEffect(() => {
        if (currentRoom) {
            setRoomName(currentRoom.roomName);
        }
    }, [currentRoom]);

    useEffect(() => {
        console.log('...', location.split('/')[2]);

        if (location.split('/')[2] == "createRoom") {
            const roomName = location.split('/')[3]
            
            if (roomName) {
                createRoom(roomName, fractalName).then((roomId) => {
                    joinRoom(roomId, accountSignature);
                }); // todo: side effect.. handle result..
                setLocation("/dashboard");
            } else {
                setIsChoosing(false);
                setIsCreating(true);
            }
        } else if (location.split('/')[2] == "chooseRoom") {
            setIsChoosing(true);
            setIsCreating(false);
        } else {
            setIsCreating(false);
            setIsChoosing(false);
        }
    }, [location]);

    useBus("account", ({ payload: account }) => {
        console.log("RoomRow.. account", account.name);
        setAccountSignature(account.signature);
        setAccountRoomId(account.room);
    }, []);

    return <div className="flex flex-row p-2 my-2 bg-gray-700">
        <h2 className="mx-2 px-2">Room</h2>
        {
            !isCreating && !isChoosing &&
            <div className="mx-2 px-2 bg-gray-600">
                <h2 className="">{roomName || <div className="w-28" />}</h2>
            </div>
        }
        {
            isCreating && <Input className="w-32" value={roomName}
                onChange={(value) => setRoomName(value)}
                onSubmit={(value) => {
                    setLocation("/dashboard/createRoom/" + value);
                }} />
        }
        {
            !isCreating && !isChoosing &&
            <div>
                <Link className="underline" href={`/dashboard/changeRoom`}>Change</Link>
                <span className="px-2">|</span>
                <Link className="underline" href={`/dashboard/createRoom`}>Create</Link>
            </div>
        }
        {
            true &&
            <div className="dropdown inline-block relative">
                <button className="bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded inline-flex items-center">
                    <span className="mr-1">change</span>
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                </button>
                <ul className="dropdown-menu absolute hidden text-gray-700 pt-1">
                    {
                        fractalRooms && 
                        fractalRooms.map((room) => {
                            return <li key={room.id}>
                                <Link href={`/dashboard/changeRoom/${room.id}`}
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-200">
                                    {room.roomName}
                                </Link>
                            </li>
                        })
                    }
                </ul>
            </div>
        }
    </div>
}  