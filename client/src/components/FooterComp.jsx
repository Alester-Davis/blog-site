import { Footer } from 'flowbite-react'
import {BsFacebook,BsInstagram,BsTwitterX,BsGithub} from 'react-icons/bs'
import { Link } from 'react-router-dom'

export default function FooterComp() {
  return (
    <Footer className='border border-t-8 border-teal-500 p-4'>
        <div className='w-full max-w-7xl mx-auto'>
            <div className='grid w-full justify-between sm:flex md:grid-cols-1'>
                <div className='flex items-center'>
                     <Link to="/" className='self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white'>
                        <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white'>Alester's</span>Blog
                    </Link>
                </div>
                <div className='grid md:grid-cols-3 grid-cols-2 md:gap-20 gap-4'>
                    <div>
                        <Footer.Title title='About'/>
                        <Footer.LinkGroup col>
                            <Footer.Link href='/about'>about</Footer.Link>
                            <Footer.Link href='/about'>about</Footer.Link>
                        </Footer.LinkGroup>
                    </div>
                    <div>
                        <Footer.Title title='About'/>
                        <Footer.LinkGroup col>
                            <Footer.Link href='/about'>about</Footer.Link>
                            <Footer.Link href='/about'>about</Footer.Link>
                        </Footer.LinkGroup>
                    </div>
                    <div>
                        <Footer.Title title='About'/>
                        <Footer.LinkGroup col>
                            <Footer.Link href='/about'>about</Footer.Link>
                            <Footer.Link href='/about'>about</Footer.Link>
                        </Footer.LinkGroup>
                    </div>
                </div>
            </div>
            <Footer.Divider />
            <div className='w-full sm:flex sm:justify-between'>
                 <Footer.Copyright href='#' by="Alester's blog" year={new Date().getFullYear()}/>
                 <div className='flex gap-10 mt-4 sm:mt-0 justify-center'>
                    <Footer.Icon href="#" icon={BsFacebook}/>
                    <Footer.Icon href="#" icon={BsInstagram}/>
                    <Footer.Icon href="#" icon={BsTwitterX}/>
                    <Footer.Icon href="#" icon={BsGithub}/>
                 </div>
            </div>
        </div>
    </Footer>
  )
}
