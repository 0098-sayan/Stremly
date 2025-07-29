export async function signup(req,res){
  const{email,password,fullName} =req.body
}

export async function login(req,res){
    res.send("login page");
}

export function logout(req,res){
    res.send("logout page");
}