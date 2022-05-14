import { render } from 'preact'
import { ConvexProvider, ConvexReactClient } from "convex-dev/react";
import { App } from './app'
import './index.css'
import convexConfig from "../convex.json";

const convex = new ConvexReactClient(convexConfig.origin);  

render(
    <ConvexProvider client={convex}>
        <App />
    </ConvexProvider>,
    document.getElementById('app')!)
