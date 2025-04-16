/* eslint-disable react/no-unescaped-entities */
// app/page.tsx or a new component
"use client";

import { useEffect, useState } from "react";
import supabase from "@/lib/supabaseClient";
import Image from "next/image";
import homeStyle from "@/styles/home.module.css"
import { Container, Skeleton } from "@mui/material";
import { GoArrowRight } from "react-icons/go";
import { Room } from "@/interfaces/interface";
import Link from "next/link";

const Home = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const fetchRooms = async () => {
      const { data, error } = await supabase.from("rooms").select("*");
      if (error) {
        console.error("Error fetching rooms:", error);
      } else {
        setRooms(data as Room[]);
      }
      setLoading(false)
    };

    fetchRooms();
  }, []);


  return (
    <div className={homeStyle.container}>

      {/* ================banner===================== */}
      <div className={homeStyle.banner}>
        <div className={homeStyle.overlay}>
          <p className="special-gothic">Simplify Your <br /> Room Management</p>
          <button>Get Started</button>
        </div>
        <div className={homeStyle.img_banner} >
          <Image src={"https://images.unsplash.com/photo-1606766923156-15fa276e8f07?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"} alt="banner img"
            fill
            priority
            quality={100}
          />
        </div>
        <div className={homeStyle.img_banner} >
          <Image src={"https://images.unsplash.com/photo-1574155267225-3b5423dd45d9?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"} alt="banner img"
            fill
            priority
            quality={100}
          />
        </div>
      </div>
      <div className={homeStyle.rest_container}>

        {/* ======================details================ */}
        <Container maxWidth="xl">
          <div className={homeStyle.details}>
            <p className={homeStyle.detailHead}>Details</p>
            <div className={homeStyle.detailsBox}>
              <div className={homeStyle.texts}>
                <p className={homeStyle.text_head}>Welcome to Roomer</p>
                <p className={homeStyle.text_desc}>Roomer made your room management easy | check out more</p>
                <Link href={"/rooms"}> <button>Discover more</button> </Link>
              </div>
              <div className={homeStyle.image}>
                <Image src={"https://images.unsplash.com/photo-1648121614863-0d76e2761fa5?q=80&w=2036&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"}
                  alt="details img"
                  quality={100}
                  // width={20}
                  // height={20}
                  fill
                  priority
                />
              </div>
            </div>
          </div>
        </Container>

        {/* ====================rooms================ */}
        <Container maxWidth={"xl"}>
          <div className={homeStyle.wrapper}>
            <div className={homeStyle.heads}>
              <h2 className={homeStyle.heading}>Rooms</h2>
             <Link href={"/rooms"}> <p>More Rooms <GoArrowRight/></p></Link>
            </div>
            <div className={homeStyle.cardContainer}>
  {loading
    ? Array.from({ length: 3 }).map((_, idx) => (
        <div className={homeStyle.card} key={idx}>
          <div className={homeStyle.imageBox}>
            <Skeleton variant="rectangular" width="100%" height="100%" animation="wave" />
          </div>
          <div className={homeStyle.content}>
            <Skeleton variant="text" width="60%" height={28} animation="wave" />
            <Skeleton variant="text" width="40%" height={20} animation="wave" />
            <Skeleton variant="text" width="90%" height={18} animation="wave" />
            <Skeleton variant="rectangular" width={100} height={36} style={{ marginTop: '8px' }} animation="wave" />
          </div>
        </div>
      ))
    : rooms.slice(0, 3).map((room) => (
        <div className={homeStyle.card} key={room.id}>
          <div className={homeStyle.imageBox}>
            <Image src={room.image_url} alt={room.name} quality={100} fill />
          </div>
          <div className={homeStyle.content}>
            <h3>{room.name}</h3>
            <p className={homeStyle.capacity}>Capacity: {room.capacity}</p>
            <p className={homeStyle.desc}>{room.description}</p>
            <Link href={`/rooms/${room.id}`}>
              <button className={homeStyle.btn}>View Room</button>
            </Link>
          </div>
        </div>
      ))}
</div>
          </div>
        </Container>

        {/* ==================== create ================== */}

        <div className={homeStyle.create_container}>
          <div className={homeStyle.left_text}>
            <p className={homeStyle.create_header}>Let's Create Your Room.</p>
            <p className={homeStyle.create_desc}>Roomer is the go-to platform for conference managers, event organizers, and theater owners seeking efficient room layout management and seat allocation. Our user-friendly tools allow registered admins to create custom room configurations, ensuring optimal space utilization and enhanced attendee experience.</p>
           <Link href={"/signup"}><button>Register Now</button></Link> 
          </div>
          <div className={homeStyle.right_image}>
            <Image
              src={"https://images.unsplash.com/photo-1502872364588-894d7d6ddfab?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"}
              alt="create img"
              quality={100}
              fill
              priority
            />
          </div>
        </div>

      </div>
    </div>
  );
}

export default Home;