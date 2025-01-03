import { Input } from "@/components/ui/input";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useFilterWarehousesRequest } from "@/api/AdminsApi";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import WarehouseType from "@/pages/warehouses/types";
import Redirect from "@/pages/redirect/Redirect";
function FilterWarehouse() {
  const [stateName, setStateName] = useState<string>("");
  const { response, isLoading, isError } =
    useFilterWarehousesRequest(stateName);
  const inputRef = useRef<HTMLInputElement>(null);
  const [filteredWarehouses, setFilterdWarehouses] = useState<WarehouseType[]>(
    [],
  );
  useEffect(() => {
    if (response) {
      setFilterdWarehouses(response.warehouses);
    }
  }, [response]);
  if (isLoading) {
    return <Redirect></Redirect>;
  }

  return (
    <div className="w-full flex-col flex gap-2 justify-start">
      <div className="flex w-full">
        <Input
          ref={inputRef}
          type="text"
          placeholder="Search for warehouses by statename..."
        />
        <Button
          onClick={() => {
            setStateName(inputRef.current?.value.toLowerCase().trim() ?? "");
            setFilterdWarehouses([]);
          }}
        >
          Search
        </Button>
      </div>
      {isError && (
        <div className="text-center text-red-500">No warehouses found!!</div>
      )}
      <hr />
      {filteredWarehouses.length != 0 && (
        <h1 className="text-2xl font-semibold ">Filtered warehouses</h1>
      )}
      {filteredWarehouses.length != 0 && (
        <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
          {filteredWarehouses.map((warehouse: WarehouseType) => (
            <Card key={warehouse._id} className="flex flex-col">
              <CardHeader className="flex-grow">
                <CardTitle>{warehouse.name}</CardTitle>
                <CardDescription>
                  {warehouse.address}, {warehouse.city}, {warehouse.state} -{" "}
                  {warehouse.pincode}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-video relative mb-4">
                  <img
                    src="https://lh3.googleusercontent.com/Rb4xxWc_kQyy7rYlg7ijtS9BI3jgc2saJlQDrU0j7r53xSsX5UWE5_MRGTHTx6lJ22VyphV4dsK2n4lHXj4e=-rw"
                    alt={warehouse.name}
                    className="absolute inset-0 w-full h-full object-cover rounded-md"
                  />
                </div>
                <div className="space-y-2 text-sm">
                  <p>
                    <strong>Email:</strong> {warehouse.email}
                  </p>
                  <p>
                    <strong>Phone:</strong> {warehouse.phone}
                  </p>
                  <p>
                    <strong>Manager name:</strong> {warehouse.manager_id.name}
                  </p>
                  <p>Manager profile</p>
                  <img
                    src={warehouse.manager_id.profile_img_url}
                    className="w-[100px] h-[100px]"
                    alt="profile"
                  />
                  <p>
                    <strong>Status:</strong>{" "}
                    <span
                      className={`capitalize ${warehouse.status === "open" ? "text-green-600" : "text-red-600"}`}
                    >
                      {warehouse.status}
                    </span>
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full">
                  Edit
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default FilterWarehouse;
