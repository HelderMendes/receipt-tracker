// Create a Convex HTTP client for server-side actions
import { ConvexHttpClient } from "convex/browser";
// import {api} from "./_generated/api";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export default convex;
