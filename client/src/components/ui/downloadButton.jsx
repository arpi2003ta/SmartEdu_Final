import { Button } from "./button";
import { Download } from "lucide-react";

export default function DownloadButton(){
    return(
        <Button variant="outline" className="flex justify-between items-center w-48 h-10 rounded-xl border-2 border-gray-400">
            <span>Download</span>
            <Download className="h-5 w-5"/>
        </Button>
    )
}