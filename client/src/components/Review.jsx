import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { formatDistanceToNow } from 'date-fns';
import { Input } from '@/components/ui/input';
import {Button, buttonVariants} from '@/components/ui/button'
import { useState } from "react";
import apiClient from "@/api/axios";
import { toast } from "sonner";
import { useParams } from "react-router-dom";
import { Rating } from 'primereact/rating';
import { useEffect } from "react";
import AddReviewForm from "./AddReviewForm";
import { Threedots } from "@/assets/Threedots";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Confirm from "./ConfirmPage";
const Review = ()=>{
    const {courseId}=useParams();
    const [comment, setComment] = useState("");
    const [rating, setRating] = useState(null);
    const [allReviews, setAllReviews]=useState([]);
    const [visibleCount, setVisibleCount]=useState(3);

    const [isEditDialogOpen, setISEditDialogOpen]=useState(false);
    const [currentReview, setCurrentReview]=useState(null);
    const [editComment, setEditComment]=useState("");
    const [editRating, setEditRating]=useState(null);

    const [isDeleteDialogOpen, setIsDeleteDialogOPen]=useState(false);


    const fetchReviews=async()=>{
        try{
            const getResponse = await apiClient.get(`/course/${courseId}/review`);
            setAllReviews(getResponse.data.reviews);
            console.log(getResponse.data.reviews);
        }catch(err){
            console.error(err.message);
        }
    }
    useEffect(()=>{
        fetchReviews();
    },[])

    const handleEditSubmit = async ()=>{
        try{
            const reviewId= currentReview._id;
            await apiClient.put(`/course/${courseId}/review/${reviewId}`,{comment:editComment, rating: editRating});
            toast.success("Review updated successfully");
            setISEditDialogOpen(false);
            fetchReviews();
        }catch(err){
            toast.error(err.response?.data?.message ||err.messagge);
        }
    }
    const addComment=async()=>{
        try{
            const postResponse = await apiClient.post(`/course/${courseId}/review`,{ comment, rating });

            if (!postResponse||!postResponse.data){
                toast.error("failed to post comment");
                return
            }else{
                toast.success("comment added");
                setComment("");
                setRating(null);
                fetchReviews();
            }

        }catch(err){
            console.log(err.message);
            toast.error(err.response?.data?.message || err.message);
        }
    }
    const handleDeleteReview = async ()=>{
        if (!currentReview) return;
        try{
            const reviewId = currentReview._id;
            const deleteResponse = await apiClient.delete(`/course/${courseId}/review/${reviewId}`);
            setISEditDialogOpen(false);
            if(deleteResponse.status===200){
                toast.success("Review deleted successfully");
                setIsDeleteDialogOPen(false);
                fetchReviews();
            }else{
                toast.error("Failed to delete review");
            }

        }catch(err){
            toast.error(err.response?.data?.messagge || err.message);
        }
    }

    const showMoreComment=()=>{
        try{
            setVisibleCount((prev)=>prev+3);
        }catch(err){
            toast.error("No more review found");
        }
    }
    const openEditBox=(review)=>{
        setCurrentReview(review);
        setEditComment(review.comment);
        setEditRating(review.rating);
        setISEditDialogOpen(true);
    }
    const openDeleteBox= (review)=>{
        setCurrentReview(review);
        setIsDeleteDialogOPen(true);
    }
    // const dots = <img src={Threedots} className="size-5 " alt="Options menu" />
    return <div className="bg-white dark:bg-[#020817] flex  items-center justify-center  ">
        <Card className="shadow-none max-w-7xl mx-auto my-5 px-4 border-none flex flex-col justify-between w-full">
            <AddReviewForm rating={rating} setRating={setRating} comment={comment} setComment={setComment} addComment={addComment}>Submit Review</AddReviewForm>
            <CardHeader>
                <CardTitle>Student Feedback</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {allReviews && allReviews.length>0?(allReviews.slice().reverse().slice(0,visibleCount).map(review=>(<div key={review._id} className="font-semibold flex flex-col justify-end space-y-2">
                    <div className="font-bold flex flex-col justify-end">
                        <div className="flex justify-between">
                            <div>
                                {review.user.name}
                            </div>
                            <div className="cursor-pointer">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <button className="outline-none">{<Threedots/>}</button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-8" align="start">
                                        <DropdownMenuGroup>
                                            <DropdownMenuItem onSelect={()=> openEditBox(review)}>
                                                Edit
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="focus:bg-red-600 focus:text-white focus:font-semibold" onSelect={()=> openDeleteBox(review)}>
                                                Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuGroup>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">
                                {review.updatedAt?(`•Edited ${formatDistanceToNow(new Date(review.updatedAt),{addSuffix:true}).replace("about","")}`):formatDistanceToNow(new Date(review.createdAt),{addSuffix:true}).replace("about","")}
                            </p>
                            {/* <div>
                                <p className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(review.createdAt),{addSuffix:true}).replace("about","")}</p>
                            </div>
                            <div>
                                
                            </div> */}
                        </div>
                    </div>
                    <span className="bg-gray-300 dark:bg-[#020817] p-1 max-w-[132px] rounded-2xl">
                        <Rating readOnly value={review.rating} cancel={false}/>
                    </span>
                    
                    <div className="font-normal">{review.comment}</div>
                </div>))):(<p className="font-light">no review posted yet</p>)}
                {allReviews.length>visibleCount &&(<div>
                    <Button variant="outline" size="lg" className="border-4 border-black dark:border-white" onClick={showMoreComment}>See More Reviews</Button>
                </div>)}
            </CardContent>
        </Card>
        <Dialog open={isEditDialogOpen} onOpenChange={setISEditDialogOpen}>
            <DialogContent>
                <AddReviewForm rating={editRating} setRating={setEditRating} comment={editComment} setComment={setEditComment} addComment={handleEditSubmit}>Edit Review</AddReviewForm>
            </DialogContent>
        </Dialog>
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOPen} >
            <DialogContent >
                <Confirm handleFunction={handleDeleteReview} setIsDeleteDialogOPen={setIsDeleteDialogOPen} Description={"Are you sure you want to delete this review?"} title={"Delete Review"}/>
            </DialogContent>
        </Dialog>
    </div>
}
export default Review;
