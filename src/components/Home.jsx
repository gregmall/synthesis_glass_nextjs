/* eslint-disable jsx-a11y/img-redundant-alt */
import React, {useState, useEffect } from 'react'
import { 
    Typography, 
    Carousel, 
    Button, 
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
 } from "@material-tailwind/react"


const Home = () => {

  const [isAge, setIsAge] = useState(false);
  const [show, setShow] = useState(true);

  useEffect(() => {
    const adult = parseInt(sessionStorage.getItem("verified"), 10); // Parse the value as an integer

    if (adult > 17) {
      setIsAge(true);
      setShow(false);
    }
  }, [isAge]);

  const handleClose = () => {
    setShow(!show);
  };

  const checkAge = (e) => {
    e.preventDefault();
    sessionStorage.setItem("verified", 18); // Store the age as a number
    setIsAge(true);
    setShow(false);
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '20px' }}>
      <div className="relative h-96 w-full md:w-4/6">
        <div className="h-auto justify-between rounded-xl border border-white bg-white/75 py-4 px-6 shadow-lg shadow-black/5 saturate-200 backdrop-blur-sm">
          <div className='flex flex-col items-center'>
       <img src="/assets/EtsySplash.png" alt="background image" className= "rounded-xl object-cover my-3"/>
            <Carousel transition={{ type: "tween", duration: 2 }} autoplay="true" loop="true" className="rounded-xl">
              <img
                src="https://firebasestorage.googleapis.com/v0/b/synthesisglass-1d07e.appspot.com/o/IMG_8735.JPG?alt=media&token=165bd96e-4259-43cf-a777-6492befa3914"
                alt="image 1"
                className="h-72 w-full object-cover size-auto"
              />
              <img
                src="https://firebasestorage.googleapis.com/v0/b/synthesisglass-1d07e.appspot.com/o/IMG_8738.JPG?alt=media&token=0301a954-e7c0-4b7b-86cf-37c6f9a2fde4"
                alt="image 2"
                className="h-72 w-full object-cover size-auto"
              />
              <img
                src="https://firebasestorage.googleapis.com/v0/b/synthesisglass-1d07e.appspot.com/o/IMG_8741.JPG?alt=media&token=0e2adf31-90f8-4041-8d14-dc9b59a62e8b"
                alt="image 3"
                className="h-72 w-full object-cover size-auto"
              />
            </Carousel>
            <Typography variant="h5" color="blue-gray">
              Makers of High Quality Glass
            </Typography>
            
          </div>
          <Typography variant="h6" color="blue-gray">
            <p>Since 1997, Synthesis Glass has created the highest quality, American made glass art using only the finest materials. We pride ourselves in creating functional art that is not only beautiful but highly functional and extremely durable. Synthesis Glass has a reputation for making top dollar pieces at affordable prices.  We are always open to custom work and/or customization of listed items.  Question? Inquiries? <a href='/question-form' className='text-blue-800 hover:text-purple-800'>CLICK HERE</a></p>
          </Typography>
          
        </div>
      </div>
      <Dialog
        className='flex flex-col justify-center items-center'
        dismiss={{ enabled: false }}
        open={show}
        handler={handleClose}
        animate={{
          mount: { scale: 1, y: 0 },
          unmount: { scale: 0.9, y: -100 },
        }}
      >
        <DialogHeader>Confirm your age</DialogHeader>
        <DialogBody>
          Are you 21 years old or older? 
        </DialogBody>
        <DialogFooter>
          <Button variant="gradient" color="green" onClick={checkAge}>
            <span>Yes</span>
          </Button>
          <a href="http://www.google.com">
            <Button className='mx-5'>
              <span>No</span>
            </Button>
          </a>
        </DialogFooter>
      </Dialog>
    </div>
  );
};

export default Home;
