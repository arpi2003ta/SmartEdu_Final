import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Rating } from 'primereact/rating';
import { Input } from '@/components/ui/input';
import {Button, buttonVariants} from '@/components/ui/button'

const AddReviewForm=({rating, setRating, comment, setComment, addComment, children})=>{

    return (
        <div>
            <Card className="rounded-3xl pb-4 mt-4">
                <CardHeader>
                    <CardTitle>Write a Review</CardTitle>
                    <CardDescription>Share your thoughts</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col space-y-6">
                    <span className="bg-gray-300 dark:bg-[#020817] p-1 max-w-40 rounded-2xl">
                        <Rating value={rating} onChange={(e) => setRating(e.value)} cancel={true} />
                    </span>
                    <Input className="min-h-16" placeholder="Write your comments here!" name="comment" value={comment} onChange={(e) => setComment(e.target.value)}></Input>
                </CardContent>
                <div className="ml-6">
                    <Button onClick={addComment}>{children}</Button>
                </div>
            </Card>
            
        </div>
    )
}

export default AddReviewForm;