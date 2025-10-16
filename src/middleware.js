import { NextResponse } from "next/server";

export function middleware(request){

 const token = request.cookies.get("auth_token")?.value;
  console.log("COOKIE TOKEN:", token); 
 const isLoggedIn = !!token;
   
    if (!isLoggedIn) {
        return NextResponse.redirect(new URL ("/login", request.url))
    }
    return NextResponse.next()
}

export const config = {
  matcher: [
    "/new",          
    "/posts/:id/edit"     
  ],
}