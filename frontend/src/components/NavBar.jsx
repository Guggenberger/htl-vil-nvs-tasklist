import { Navbar, Nav } from'react-bootstrap'; 
import { LinkContainer } from'react-router-bootstrap';

const NavBar = (props) => { 
    const { brandItem, navItems } = props; 
    let bg = "dark";
    let variant= "dark";
    let usingFakeBackend = (process.env.REACT_APP_USE_FAKEBACKEND === 'true');

    if (usingFakeBackend) {
        bg = "light";
        variant= "light";
    }

    const test = () => {
        alert("click");
    }

    return (
        <Navbar collapseOnSelect expand="lg" bg={bg} variant={variant}>
            <Navbar.Brand>
                <LinkContainer to={brandItem?.to || "/"} className='nav-item nav-link'>
                    <Nav.Item> {brandItem?.title || "MyNavBar"} </Nav.Item>
                </LinkContainer>
                </Navbar.Brand>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav"/>
                        <Navbar.Collapse id="responsive-navbar-nav">
                            <Nav className="mr-auto">
                                {navItems && navItems.map(item=> ( 
                                    <LinkContainer 
                                        key={item.to}
                                        exact
                                        to={item.to} 
                                        className='nav-item nav-link' >
                                        <Nav.Link>{item.title}</Nav.Link>
                                    </LinkContainer>
                                ))}
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>    
            ); 
        }; 
            
export default NavBar; 