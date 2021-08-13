import Button from "@material-tailwind/react/Button";
import Icon from "@material-tailwind/react/Icon";
import { signIn } from "next-auth/client";
import Image from "next/image";

function Login() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <Image
        className="cursor-pointer h-12 w-12 rounded-full ml-2"
        src="https://links.papareact.com/1ui"
        objectFit="contain"
        height="300"
        width="550"
      />
      <Button className="w-44 mt-10" color="blue" buttonType="filled" ripple="light" onClick={signIn}>
        Login
      </Button>
    </div>
  );
}

export default Login;
