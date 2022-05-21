import { useState, useEffect, useErrorBoundary } from 'preact/hooks';
// import { useLocation } from 'wouter-preact';

import { useQuery, useMutation } from '@convex/_generated';
import Input from './shared/Input';
import { Link, useLocation } from 'wouter-preact';
import RoomRow from './pages/dashboard/account/roomRow';
import Select from './shared/Select';

// import useBus from "use-bus";

// import ConnectPage from './pages/connect';
// import DashboardPage from './pages/dashboard';
// import ErrorBoundary from './shared/ErrorBoundary';
// import TestPage from './pages/test';

export function App() {
  // const [location, setLocation] = useLocation();
  // const [isAuthorized, setIsAuthorized] = useState(false);

  // useEffect(() => {
  //   if (location.startsWith("/fractals")) {
  //     // proceed to fractals page - ignore authorization
  //   } else if (location.startsWith("/test")) {
  //     // setLocation('/test');
  //   } else if (isAuthorized && location.startsWith("/connect")) {
  //     setLocation('/dashboard');
  //   } else if (!isAuthorized && !location.startsWith("/connect")) {
  //     setLocation('/connect');
  //   }
  // }, [isAuthorized, location]);

  const [error, resetError] = useErrorBoundary(
    error => console.error(error),
  );

  const [location, setLocation] = useLocation();

  const [userId, setUserId] = useState("");

  const user = useQuery('getUser', userId);
  const fractalRooms = useQuery('getFractalRooms', userId);

  const userSaveAccount = useMutation("userSaveAccount");
  const userSaveRoom = useMutation("userSaveRoom");
  // const userSaveRoom = useMutation("userSaveRoom");

  useEffect(() => {
    if (window.localStorage.getItem('userId')) {
      setUserId(window.localStorage.getItem('userId') || "");
    } // otherwise register user when changing name..
  }, []);

  // useEffect(() => {
  //   if (user && user._id && user._id !== userId) {
  //     window.localStorage.setItem("userId", userId);
  //     setUserId()
  //   }
  // }, [user]);

  useEffect(() => {
    console.log("location", location);

    if (location.startsWith('/account')) {
      const param = location.split('/')[2];
      if (param) {
        const effectAccount = async (value: string) => {
          const response = await userSaveAccount(userId, value);
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
    }
  }, [location]);

  return <div className="flex flex-col h-full font-mono text-white p-4">
    <h2 className="text-xl">Fractal Genesis, May 21th</h2>
    <div className="bg-gray-700 flex flex-row p-2 mt-2">
      <h2 className="mr-2">Account name</h2>
      {
        location.startsWith('/account') && <div className="ml-2"><Input href="/account" /></div>
      }
      {
        !location.startsWith('/account') && user != null && <div className="flex flex-row">
          <div className="mx-4 bg-gray-600 px-2 text-lg rounded">{user.name}</div>
          <Link className="underline text-sm" href="/account">Edit</Link>
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
      <h2 className="mr-4">Party</h2>
      {
        !location.startsWith('/room') && user && <div className="flex flex-row">
          <div className="mx-4 bg-gray-600 px-2 text-lg rounded">
            {user.room ? <span className="">{user.room}</span> : <div className="w-28"></div>}
          </div>
          {
            user.room && user.room != 'Unassigned' &&
              <Link className="underline" href="/room">Change</Link>
          }
          {
            (!user.room || user.room == 'Unassigned') &&
              <Link className="underline text-xl" href="/room">Select</Link>
          }
        </div>
      }
      {
        location.startsWith('/room') && user && <div className="">
          <Select default={user.room} options={fractalRooms} href="/room" />
          <Link className="underline text-sm ml-2" href="/">Cancel</Link>
        </div>
      }
    </div>
    {/* <Input value={user.account} onChange={() => {}} onSubmit={onSubmitAccount} />
    <h2 className="">Room</h2>
    <Input value={user.room} onChange={() => {}} onSubmit={onSubmitRoom} />
    <h2 className="">Consensys</h2>
    <div>
      <div>first votes for second</div>
      <div className="">third votes for second</div>
    </div>
    <h2 className="">Ranking</h2>
    <div className="">
      <h2 className="">berliangor can receive 2 reputation (Confirm)</h2>
      <div className="">receives 1 reputation</div>
      <div className="">berliangor chosen first (6 reputation)</div>
      <div className="">another chosen second (5 reputation)</div>
      <div className="">someone can be chosen third (Finalize)</div>
    </div> */}
  </div>

  // return <TestPage />

  return <div className="flex flex-col h-full font-mono text-white p-4">
    {
      error && <div className="flex flex-col items-center justify-center">
        <h1>Error</h1>
        <pre>{error.message}</pre>
        <button onClick={resetError}>Reset</button>
      </div>
    }
    <h2 className="text-4xl">{user ? user.accountName : "Loading.."}</h2>
    {/* {
      location.startsWith('/fractals') && <FractalsPage />
    }
    {
      location.startsWith('/test') && <TestPage />
    }
    {
      location.startsWith('/connect') && <ConnectPage />
    }
    {
      location.startsWith('/dashboard') && <DashboardPage />
    } */}
  </div>
}

// one user cannot be in multiple rooms and make proposals there..
// when moving to another room move also his proposal..
// get rid of proposals table..
// just in accounts table.. you choose your room.. and choose who you vote for..
// if who you vote for moves to another room.. also reset yours..
// if one is chosen.. reset everyone vote to himself..
// can we get rid of ranking table..
// just assign ranking in accounts table..
// once ranking is assigned.. cannot be voted for..
// cannot move to another room.. not changing his room anymore in table..