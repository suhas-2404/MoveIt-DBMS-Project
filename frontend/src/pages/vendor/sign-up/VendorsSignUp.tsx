import { MultiStepForm } from "@/components/ui/multi-step-form";
import { ShoppingBag } from "lucide-react";
import PersonalDetailsSection from "./components/PersonalDetailsSection";
import ShopDetailsSection from "./components/ShopDetailsSection";
import AddressDetailsSection from "./components/AddressDetailsSection";
import MultiStepFormContextProvider from "@/context/MultiStepFormContext";
import { useEffect, useState } from "react";
import { VendorsSignUpData } from "./types";
import SummarySection from "./components/SummarySection";
import AppLogo from "@/components/AppLogo";
import { Card, CardHeader } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useIsLoggedInRequest } from "@/api/AuthApi";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Redirect from "@/pages/redirect/Redirect";

const VendorsSignUp = () => {
  const [signUpData, setSignUpData] = useState<VendorsSignUpData>({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirm_password: "",
    shop_name: "",
    shop_description: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });
  const {
    isSignedIn,
    isLoading: isAuthLoading,
    isError: isAuthError,
  } = useIsLoggedInRequest();
  const navigate = useNavigate();

  useEffect(() => {
    if (isSignedIn) {
      navigate("/", { replace: true });
      toast("You are already signed in", { icon: "🚨" });
    }

    if (isAuthError) {
      toast("Sign in as vendor", { icon: "🚨" });
    }
  }, [isSignedIn, isAuthError, navigate]);

  if (isAuthLoading) {
    return <Redirect />;
  }

  const updateSignUpData = (data: Partial<VendorsSignUpData>) => {
    setSignUpData((prevSignUpData) => ({
      ...prevSignUpData,
      ...data,
    }));
  };

  return (
    <MultiStepFormContextProvider
      stepsArray={[
        <PersonalDetailsSection
          signUpData={signUpData}
          updateSignUpData={updateSignUpData}
        />,
        <ShopDetailsSection
          signUpData={signUpData}
          updateSignUpData={updateSignUpData}
        />,
        <AddressDetailsSection
          signUpData={signUpData}
          updateSignUpData={updateSignUpData}
        />,
        <SummarySection signUpData={signUpData} />,
      ]}
    >
      <div className="flex md:flex-row h-screen items-center justify-around px-4 gap-5 bg-main relative">
        <div className="absolute top-4 left-7">
          <AppLogo />
        </div>
        <div className="w-[50vw] h-full hidden md:block">
          <img
            className="w-full h-full object-scale-down py-10"
            src="/images/vendor-illustration-signup.png"
            alt="Login"
            draggable="false"
          />
        </div>
        <Card className="md:w-[50vw] max-md:w-screen max-w-lg h-[75vh]">
          <ScrollArea className="h-full">
            <MultiStepForm
              formHeader={
                <CardHeader>
                  <div className="flex flex-col items-center justify-center gap-1">
                    <h1 className="text-[1.7rem] font-bold flex items-center gap-2">
                      <div className="flex items-center gap-2">
                        <ShoppingBag />
                        <h1 className="text-2xl font-bold">Vendor Sign Up</h1>
                      </div>
                    </h1>
                    <p className="text-muted-foreground text-gray-400 text-[0.9rem]">
                      Sign up to your account
                    </p>
                  </div>
                </CardHeader>
              }
            />
          </ScrollArea>
        </Card>
      </div>
    </MultiStepFormContextProvider>
  );
};

export default VendorsSignUp;
