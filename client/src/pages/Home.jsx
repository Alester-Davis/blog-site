import { Button, Input, Textarea } from "@nextui-org/react";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";

export default function Home() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    emailSubject: "",
    content: "",
  });
  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    console.log(regex.test(email));
    return regex.test(email);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(JSON.stringify(formData));
    if (!formData.name) toast.error("Name is required");
    if (!formData.email) toast.error("Email is required");
    if (!formData.phone) toast.error("Phone number is required");
    if (!formData.emailSubject) toast.error("Email subject is required");
    if (!formData.content) toast.error("Message content is required");

    if (formData.email && !validateEmail(formData.email)) {
      console.log("hello");
      toast.error("Please enter a valid email address");
    }

    if (formData.phone && formData.phone.length !== 10) {
      toast.error("Phone number must be exactly 10 digits");
    }
    if (
      formData.name &&
      formData.email &&
      formData.phone &&
      formData.emailSubject &&
      formData.content &&
      validateEmail(formData.email) &&
      formData.phone.length == 10
    ) {
      try {
        const res = await fetch(`/api/mail/sendUserMail`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        console.log(data);
        toast.success("Mail sent successfully");
        setFormData({
          name: "",
          email: "",
          phone: "",
          emailSubject: "",
          content: "",
        });
      } catch (error) {
        toast.error(error);
      }
    }
  };
  return (
    <div className="w-full">
      <section className="flex justify-center items-center relative flex-col lg:flex-row h-[92vh] p-6 lg:p-20 w-[100%]">
        <div className="flex flex-col text-center justify-center items-center lg:text-start lg:justify-start lg:items-start p-4 lg:pr-10">
          <h3 className="text-3xl md:text-5xl font-bold">Hello, I am</h3>
          <h1 className="text-5xl md:text-7xl font-bold text-purple-500">
            Alester Davis E
          </h1>
          <p className="text-md md:text-xl">
            An undergraduate student pursuing Information Science and
            Engineering at Kumaraguru College of Technology and a passionate
            full stack developer with a love for the MERN stack. I thrive on
            turning ideas into functional and aesthetically pleasing solutions.
          </p>
          <div className="flex space-x-4 mt-4 items-center justify-center md:justify-start lg:items-start">
            <a href="https://github.com/Alester-Davis">
              <FaGithub className="w-8 h-8 text-purple-500" />
            </a>
            <a href="https://www.linkedin.com/in/alester-davis-85381a225/">
              <FaLinkedin className="w-8 h-8 text-purple-500" />
            </a>
            <a href="#twitter">
              <FaTwitter className="w-8 h-8 text-purple-500" />
            </a>
          </div>
          <a href="/Alester.pdf" download>
            <Button
              variant="bordered"
              className="border-2 border-purple-500 text-purple-500 font-bold mt-5"
            >
              Download CV
            </Button>
          </a>
        </div>
        <div className="flex-shrink-0 w-36 h-36 md:h-52 md:w-52 lg:h-80 lg:w-80">
          <img
            src="Alester.jpg"
            alt="Your Image Description"
            className="w-full h-full rounded-full border-1"
          />
        </div>
      </section>
      <section className="skill py-16 bg-white">
        <div className="skill-content max-w-7xl mx-auto px-4 sm:px-6 lg:px-3">
          <div className="skill-part text-center mb-10">
            <h1 className="skill-heading text-4xl md:text-5xl font-bold">
              How Can I <span className="text-purple-600">Help You?</span>
            </h1>
            <p className="skill-part-content mt-4 text-lg md:text-xl text-gray-600 max-w-4xl mx-auto">
              I help in transforming ideas into reality through my expertise in
              Software Engineering, Frontend Development, Backend Development,
              and UX/UI Design. My passion for innovation and user-centric
              design drives me to create efficient and intuitive technological
              solutions.
            </p>
          </div>

          <div className="timeline relative">
            <div className="hidden sm:block absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-purple-600"></div>

            <div className="timeline-item mx-9 my-5 rounded-lg z-10">
              <div className="bg-white rounded-lg p-6">
                <h2 className="text-xl font-semibold text-purple-600">
                  UX/UI Design
                </h2>
                <p className="mt-2 text-gray-600 text-lg">
                  Crafting intuitive and aesthetically pleasing interfaces that
                  enhance user experience is at the core of what I do. I focus
                  on understanding user needs and translating them into seamless
                  designs that are both functional and visually appealing.
                </p>
              </div>
            </div>

            <div className="timeline-item mx-9 my-5 rounded-lg">
              <div className="timeline-content bg-white rounded-lg p-6 max-w-md md:order-1">
                <h2 className="text-xl font-semibold text-purple-600">
                  Frontend Development
                </h2>
                <p className="mt-2 text-gray-600 text-lg">
                  Bringing designs to life through clean, efficient code is my
                  specialty. I focus on building responsive, user-friendly
                  interfaces using modern frameworks and tools to ensure a
                  smooth and engaging user experience across all devices.
                </p>
              </div>
            </div>

            <div className="timeline-item mx-9 my-5 rounded-lg">
              <div className="timeline-content bg-white rounded-lg p-6 max-w-md md:order-1">
                <h2 className="text-xl font-semibold text-purple-600">
                  Backend Development
                </h2>
                <p className="mt-2 text-gray-600 text-lg">
                  I develop robust, scalable backends that power your
                  applications with efficiency and security. From databases to
                  server-side logic, I ensure that your application runs
                  smoothly and can handle the demands of your users.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="contact"
        className="contact py-12 px-6 md:px-8 lg:px-72 h-[100vh] flex flex-col justify-center"
      >
        <h2 className="text-4xl font-bold text-center mb-8">
          Contact <span className="text-purple-600">Me!</span>
        </h2>
        <form action="#" className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              type="text"
              placeholder="Name"
              className="w-full"
              fullWidth
              variant="underlined"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
            <Input
              type="text"
              placeholder="Email"
              className="w-full"
              fullWidth
              variant="underlined"
              errorMessage=""
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              type="number"
              placeholder="Phone Number"
              className="w-full"
              fullWidth
              variant="underlined"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
            />
            <Input
              type="text"
              placeholder="Email Subject"
              className="w-full"
              fullWidth
              variant="underlined"
              value={formData.emailSubject}
              onChange={(e) =>
                setFormData({ ...formData, emailSubject: e.target.value })
              }
            />
          </div>
          <Textarea
            placeholder="Your message"
            rows={10}
            className="w-full"
            fullWidth
            variant="underlined"
            value={formData.content}
            onChange={(e) =>
              setFormData({ ...formData, content: e.target.value })
            }
          />
          <Button
            type="submit"
            className="bg-purple-600 text-white font-bold mt-4"
            fullWidth
          >
            Send Message
          </Button>
        </form>
      </section>
      <footer className="w-full h-16 text-center bg-purple-600 flex justify-center items-center">
        <div className="footer-text">
          <p className="text-white text-sm">
            Copyrights &copy; 2024 by Alester Davis E.
          </p>
        </div>
        <div className="footer-topup">
          <a href="#home">
            <i className="bx bx-up-arrow-alt"></i>
          </a>
        </div>
      </footer>
      <Toaster position="bottom-right"></Toaster>
    </div>
  );
}
