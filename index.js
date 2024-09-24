const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const express = require('express');
const app = express();
const port = 3000;
const z = require('zod');
app.use(express.json())
const emailSchema = z.object({
    subject: z.string().nonempty(),
    body: z.string().nonempty(),
    sender: z.string().email(),
    recipient: z.string().email(),
  });
  
app.post('/emails', async (req, res) => {
    const { subject, body, sender, recipient } = req.body;
  
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
  
app.get('/emails', async (req, res) => {
    try {
      const emails = await prisma.email.findMany();
      res.json(emails);
    } catch (error) {
      res.status(500).json({ error: "Error fetching emails" });
    }
  });
  
app.listen(port)