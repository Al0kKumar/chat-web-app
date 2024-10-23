import { Request, Response } from 'express'
import {z} from 'zod'
import Messages from '../../../models/Message'


const chathistorySchema = z.object({
    senderid: z.string(),
    receiverid: z.string(),
})

const chathistory = async (req: Request,res: Response) => {
   
    const check = chathistorySchema.safeParse(req.body);

    if(!check.success){
        return res.status(401).json({msg:"Invalid inouts"})
    }

    const senderid = req.user?.id;

    const { receiverid } = req.body;

    try {
        const chats = await Messages.find({
            $or:[
                {senderid: senderid, receiverid: receiverid},
                {senderid: receiverid, receiverid: senderid}
            ]
        })
        .sort({createdAt: 1})
    
        return res.status(200).json({chats})

    } catch (error) {
        console.error('Error during fetching chats history', error);
        return res.status(500).json({msg:"failed to fetch chats history"})
        
    }

    

}


export default chathistory;