'use client'
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import {
  Typography,
  Carousel,
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react"
import Link from 'next/link'

const CAROUSEL_IMAGES = [
  {
    src: "https://firebasestorage.googleapis.com/v0/b/synthesisglass-1d07e.appspot.com/o/IMG_8735.JPG?alt=media&token=165bd96e-4259-43cf-a777-6492befa3914",
    alt: "image 1"
  },
  {
    src: "https://firebasestorage.googleapis.com/v0/b/synthesisglass-1d07e.appspot.com/o/IMG_8738.JPG?alt=media&token=0301a954-e7c0-4b7b-86cf-37c6f9a2fde4",
    alt: "image 2"
  },
  {
    src: "https://firebasestorage.googleapis.com/v0/b/synthesisglass-1d07e.appspot.com/o/IMG_8741.JPG?alt=media&token=0e2adf31-90f8-4041-8d14-dc9b59a62e8b",
    alt: "image 3"
  },
]

const Home = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const adult = parseInt(sessionStorage.getItem("verified"), 10);
    if (adult <= 17 || isNaN(adult)) {
      setShow(true);
    }
  }, []);

  const checkAge = (e) => {
    e.preventDefault();
    sessionStorage.setItem("verified", 18);
    setShow(false);
  };

  return (
    <div className="flex justify-center mt-5 px-4">
      <div className="w-full max-w-5xl rounded-xl border border-white bg-white/75 py-6 px-6 shadow-lg shadow-black/5 saturate-200 backdrop-blur-sm">
        <div className="flex flex-col items-center mb-6">
          <Image
            src="/assets/EtsySplash.png"
            alt="Synthesis Glass banner"
            width={800}
            height={200}
            className="rounded-xl object-cover my-3 w-full max-w-2xl"
            priority
          />
        
      
            <Link href="/glass" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
              Shop Now!
            </Link>
        
        </div>
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="w-full md:w-1/2">
            <Carousel
              transition={{ type: "tween", duration: 2 }}
              autoPlay
              loop
              className="rounded-xl"
            >
              {CAROUSEL_IMAGES.map(({ src, alt }) => (
                <img
                  key={alt}
                  src={src}
                  alt={alt}
                  className="h-72 w-full object-cover"
                />
              ))}
            </Carousel>
          </div>
          <div className="w-full md:w-1/2 flex flex-col justify-center gap-3">
            <Typography variant="h5" color="blue-gray">
              Makers of High Quality Glass
            </Typography>
            <Typography variant="paragraph" color="blue-gray">
              Since 1997, Synthesis Glass has created the highest quality, American made glass art using only the finest materials. We pride ourselves in creating functional art that is not only beautiful but highly functional and extremely durable. Synthesis Glass has a reputation for making top dollar pieces at affordable prices. We are always open to custom work and/or customization of listed items.
            </Typography>
            <Typography variant="paragraph" color="blue-gray">
              Question? Inquiries?{' '}
              <a href='/question-form' className='text-blue-800 hover:text-purple-800 font-semibold'>
                CLICK HERE
              </a>
            </Typography>
          </div>
        </div>
        <div className="flex justify-center mt-8 text-xs"><em>Copyright &copy; 2026 Synthesis Glass, All rights reserved.</em></div>
      </div>

      <Dialog
        className='flex flex-col justify-center items-center'
        dismiss={{ enabled: false }}
        open={show}
        handler={() => {}}
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
