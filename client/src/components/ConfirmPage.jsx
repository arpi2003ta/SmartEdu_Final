import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {Button, buttonVariants} from '@/components/ui/button'

const Confirm=({handleFunction, setIsDeleteDialogOPen, Description, title})=>{
    return (
        <div className="flex justify-center items-center ">
            <Card className="w-full max-w-md border-none shadow-none">
                <CardHeader>
                    <CardTitle>{title}</CardTitle>
                    <CardDescription> {Description}  </CardDescription>
                </CardHeader>
                <CardFooter>
                    <div className="flex justify-between gap-10">
                        <Button variant="outline" size="xl"><p className="text-lg" onClick={()=>setIsDeleteDialogOPen(false)}>Cancel</p></Button>
                        <Button variant="destructive" size="xl" onClick={handleFunction}><p className="text-lg">Delete</p></Button>
                    </div>
                </CardFooter>
            </Card>
        </div>
        
    )
}

export default Confirm;