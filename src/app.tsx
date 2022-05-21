import { useState, useEffect, useErrorBoundary } from 'preact/hooks';

import config from '@convex/config';
import { useQuery, useMutation } from '@convex/_generated';
import { Link, useLocation } from 'wouter-preact';
import Input from './shared/Input';
import Select from './shared/Select';
import { numberToWord } from './shared/helpers';

function MainApp() {
  const [location, setLocation] = useLocation();

  const [userId, setUserId] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);

  const user = useQuery('getUser', userId);
  const fractalRooms = useQuery('getFractalRooms', userId);
  const fractalVoters = useQuery('getFractalVoters', userId);
  const voteOptions = useQuery('getVoteOptions', userId);
  const consensusNumber = useQuery('getConsensusNumber', userId);
  const fractalRanking = useQuery('getFractalRanking', userId);

  const userSaveAccount = useMutation("userSaveAccount");
  const userSaveRoom = useMutation("userSaveRoom");
  const userSaveVote = useMutation("userSaveVote");
  const userConfirmVote = useMutation("userConfirmVote");

  useEffect(() => {
    // (fractalVoters.length + 1) || fractalRanking.length
    if (fractalRanking &&
      fractalRanking.length > 0 &&
      (fractalRanking.length == config.highestRanking)
    ) {
      setIsCompleted(true);
    } else {
      setIsCompleted(false);
    }
  }, [fractalRanking]);

  useEffect(() => {
    if (window.localStorage.getItem('userId')) {
      setUserId(window.localStorage.getItem('userId') || "");
    }
  }, []);

  useEffect(() => {
    console.log("location", location);

    if (location.startsWith('/account')) {
      const param = location.split('/')[2];
      if (param) {
        const effectAccount = async (value: string) => {
          const response = await userSaveAccount(userId, decodeURIComponent(value));
          if (response) {
            const newUserId = response.toString();
            window.localStorage.setItem("userId", newUserId);
            setUserId(newUserId);
          }
        }

        effectAccount(param);
        setLocation('/');
      }
    } else if (location.startsWith('/room')) {
      const param = location.split('/')[2];
      if (param) {
        userSaveRoom(userId, decodeURIComponent(param));
        setLocation('/');
      }
    } else if (location.startsWith('/vote')) {
      const param = location.split('/')[2];
      if (param) {
        userSaveVote(userId, decodeURIComponent(param));
        setLocation('/');
      }
    } else if (location.startsWith('/confirm')) {
      userConfirmVote(userId);
      setLocation('/');
    } else if (location.startsWith('/logout')) {
      window.localStorage.setItem('userId', '');
      setUserId('');
      setLocation('/');
    }
  }, [location]);

  return <div className="flex flex-col h-full font-mono text-white p-4">
    <div className="flex flex-row">
      <h2 className="text-xl">{config.fractalName}</h2>
      {
        userId && <Link className="text-sm ml-2 underline" href="/logout">Logout</Link>
      }
    </div>
    <div className="bg-gray-700 flex flex-row p-2 mt-2">
      <h2 className="mr-2">Account name</h2>
      {
        location.startsWith('/account') && <div className="ml-2"><Input href="/account" /></div>
      }
      {
        !location.startsWith('/account') && user != null && <div className="flex flex-row">
          <div className="mx-4 bg-gray-600 px-2 text-lg rounded">{user.name}</div>
          {
            !user.hasConfirmed &&
            <Link className="underline text-sm" href="/account">Edit</Link>
          }
        </div>
      }
      {
        !location.startsWith('/account') && userId.length == 0 && <div className="flex flex-row">
          <div className="mx-4 bg-gray-600 px-2 text-lg w-28"></div>
          <Link className="underline text-xl" href="/account">Setup</Link>
        </div>
      }
      {
        !location.startsWith('/account') && userId != null && user == null && <div>
          <div className="mx-4 bg-gray-600 w-28"></div>
        </div>
      }
    </div>
    <div className="bg-gray-700 flex flex-row p-2 mt-2">
      <h2 className="mr-4">Fractal room</h2>
      {
        !location.startsWith('/room') && user && <div className="flex flex-row">
          <div className="mx-4 bg-gray-600 px-2 text-lg rounded">
            {user.room ? <span className="">{user.room}</span> : <div className="w-28"></div>}
          </div>
          {
            user.hasVoted && !user.hasConfirmed &&
            <Link className="underline text-sm" href="/room">Change</Link>
          }
          {
            !user.hasConfirmed && !user.hasVoted &&
            <Link className="underline text-xl" href="/room">Choose</Link>
          }
          {
            user.hasConfirmed &&
            <span className="text-sm">locked</span>
          }
        </div>
      }
      {
        location.startsWith('/room') && user && fractalRooms && <div className="">
          <Select default={user.room} options={fractalRooms.map(r => r.name)} href="/room" />
          <Link className="underline text-sm ml-2" href="/">Cancel</Link>
        </div>
      }
    </div>
    {
      !isCompleted &&
      <div>
        <div className="flex flex-row mt-2">
          <h2 className="text-xl">Consensus</h2>
          {
            user && consensusNumber && <div className="flex flex-row text-sm ml-2">
              <span className="">{consensusNumber.consensusReached}</span>
              <span className="px-1">of</span>
              <span className="">{config.highestRanking}</span>
              <span className="px-1">agreed on</span>
              <span className="text-sm bg-gray-600 rounded px-2">{user.vote}</span>
            </div>
          }
        </div>
        <div className="flex flex-col">
          {
            user && <div>
              <div className="bg-gray-700 flex flex-row p-2 mt-2">
                <h2 className="text-lg px-2 rounded bg-gray-600">{user.name}</h2>
                <h2 className="text-sm px-2">is voting for</h2>
                {
                  !location.startsWith('/vote') && <div className="flex flex-row">
                    {
                      user.vote &&
                      <h2 className="text-lg px-2 rounded bg-gray-600">{user.vote}</h2>
                    }
                    {
                      (!user.vote || user.vote.length == 0) &&
                      <div className="w-24 bg-gray-600 rounded"></div>
                    }
                    {
                      !user.hasVoted &&
                      <Link className="underline text-xl ml-2" href="/vote">Choose</Link>
                    }
                    {
                      user.hasVoted &&
                      <Link className="underline text-sm ml-2" href="/vote">Change</Link>
                    }
                  </div>
                }
                {
                  location.startsWith('/vote') && voteOptions && <div>
                    <Select default={user.vote} options={voteOptions.map(v => v.name)} href="/vote" />
                    <Link className="underline text-sm ml-2" href="/">Cancel</Link>
                  </div>
                }
              </div>
            </div>
          }
          {
            fractalVoters && fractalVoters.map((voter: any) => <div>
              <div className="bg-gray-700 flex flex-row p-2 mt-2">
                <h2 className="text-lg px-2 rounded bg-gray-600">{voter.name}</h2>
                <h2 className="text-sm px-2">is voting for</h2>
                {
                  voter.vote && <h2 className="text-lg px-2 rounded bg-gray-600">{voter.vote}</h2>
                }
                {
                  !voter.vote && <div className="w-24 rounded bg-gray-600"></div>
                }
              </div>
            </div>)
          }
        </div>
      </div>
    }
    <div className="flex flex-row mt-2">
      <h2 className="text-xl">Ranking</h2>
      {
        !isCompleted &&
        <div className="text-sm ml-2">
          <span>next to be ranked</span>
          <span className="mx-2 px-2 rounded bg-gray-600">
            {
              fractalRanking && fractalRanking.length > 0 ?
                numberToWord(fractalRanking[fractalRanking.length - 1].ranking - 1) :
                numberToWord(config.highestRanking)
            }
          </span>
        </div>
      }
      {
        isCompleted &&
        <Link href={`/view/${user.room}`} className="text-sm ml-2 underline">Share</Link>
      }
      {
        !location.startsWith('/vote') && !isCompleted &&
        consensusNumber && consensusNumber.consensusReached >= consensusNumber.requiredConsensus &&
        user && config.defaultRoom != user.room &&
        fractalVoters && fractalVoters.length >= config.highestRanking-1 &&
        <Link className="underline text-xl ml-2" href="/confirm">Confirm</Link>
      }
    </div>
    <div className="flex-flex col">
      {fractalRanking && fractalRanking.map((r: any) => <div className="flex flex-row p-2 mt-2 bg-gray-700">
        <h2 className="text-lg px-2 rounded bg-gray-600">{r.name}</h2>
        <h2 className="text-base mx-2">ranked as</h2>
        <h2 className="text-lg px-2 rounded bg-gray-600">{numberToWord(r.ranking)}</h2>
        {
          r.ranking == config.highestRanking &&
          <h2 className="text-sm mx-2">(highest)</h2>
        }
      </div>)}
    </div>
  </div>
}

function ViewOnlyApp({ roomName }: { roomName: string }) {
  const room = useQuery('getViewRoom', decodeURIComponent(roomName));

  return <div className="flex flex-col h-full font-mono text-white p-4">
    <div className="flex flex-row">
      <h2 className="text-xl">{config.fractalName}</h2>
      {
        room && room.name && <div className="text-sm ml-2">
          {room.name}
        </div>
      }
    </div>
    <div className="flex flex-row mt-2">
      <h2 className="text-xl">Ranking</h2>
      {
        room && room.ranking && <div className="text-sm ml-2">
          <span>completed</span>
          <span className="mx-2 px-2">
            of {room.ranking.length} members
          </span>
        </div>
      }
    </div>
    <div className="flex-flex col">
      {room && room.ranking.map((r: string, i: number) => <div className="flex flex-row p-2 mt-2 bg-gray-700">
        <h2 className="text-lg px-2 rounded bg-gray-600">{r}</h2>
        <h2 className="text-base mx-2">ranked as</h2>
        <h2 className="text-lg px-2 rounded bg-gray-600">{numberToWord(config.highestRanking-i)}</h2>
        {
          i == 0 &&
          <h2 className="text-sm mx-2">(highest)</h2>
        }
      </div>)}
    </div>
  </div>
}

export function App() {
  const [location, setLocation] = useLocation();
  const [viewRoomName, setViewRoomName] = useState('');

  const [error, resetError] = useErrorBoundary(
    (error) => {
      console.error(error)
      // setLocation("/");
    }
  );

  useEffect(() => {
    if (location.startsWith('/view')) {
      const param = location.split('/')[2];
      setViewRoomName(param);
    } else {
      setViewRoomName('');
    }
  }, [location]);

  return <div>
    {error && <div className="text-white"><h2>{error.toString()}</h2><hr /></div>}
    {
      viewRoomName ? <ViewOnlyApp roomName={viewRoomName} /> : <MainApp />
    }
  </div>
}