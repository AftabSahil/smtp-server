import { PrismaClient } from "@prisma/client"
import express from "express"
import {z} from "zod"
import bodyParser from "body-parser"
import { dirname } from "path"
import { fileURLToPath } from "url"
const prisma = new PrismaClient();
const app = express();
const port = 3000;
const __dirname = dirname(fileURLToPath(import.meta.url));
app.use(bodyParser.urlencoded({extended:true}));
const emailSchema = z.object({
    subject: z.string().nonempty(),
    body: z.string().nonempty(),
    sender: z.string().email(),
    recipient: z.string().email(),
  });
  
app.post('/emails', async (req, res) => {
    const subject = req.body.subject;
    const body = req.body.body;
    const sender = req.body.sender;
    const recipient  = req.body.recipient;
  
    try {
      const email = await prisma.users.create({
        data: {
          subject,
          body,
          sender,
          recipient,
        },
      });
      res.status(201).json(email);
    } catch (error) {
        console.log(error)
      res.status(500).json({ error: "Error creating email" });
    }
  });
app.get('/',(req, res)=>{res.sendFile(__dirname+"/public/index.html")})
app.get('/emails', async (req, res) => {
    try {
      const emails = await prisma.users.findMany();
      res.json(emails);
    } catch (error) {
      res.status(500).json({ error: "Error fetching emails" });
    }
  });

app.put('/emails/:id', async (req, res) => {
    const { id } = req.params;
    const { subject, body, sender, recipient } = req.body;
  
    try {
      const updatedEmail = await prisma.users.update({
        where: { id: parseInt(id) },
        data: { subject, body, sender, recipient },
      });
      res.json(updatedEmail);
    } catch (error) {
      res.status(500).json({ error: "Error updating email" });
    }
  });

  app.delete('/emails/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      await prisma.users.delete({
        where: { id: parseInt(id) },
      });
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Error deleting email" });
    }
  });
    
  
app.listen(port)