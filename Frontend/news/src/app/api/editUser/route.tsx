
import type { NextApiRequest, NextApiResponse } from 'next';

const updateRole = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'PATCH') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const { userId, newRole } = req.body;

        // Validate the incoming data
        if (!userId || !newRole) {
            return res.status(400).json({ message: 'Invalid request data' });
        }

        // Call the ASP.NET backend
        const response = await fetch('', { //enter ASP URL
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId, newRole }),
        });

        const data = await response.json();

        // Forward the response from ASP.NET backend to the frontend
        if (response.ok) {
            return res.status(200).json(data);
        } else {
            return res.status(response.status).json(data);
        }
    } catch (error) {
        return res.status(500).json({ message: 'Server error'});
    }
};

export default updateRole;

/////////////////////////////////////////////ASP BACKEND//////////////////////////////////////////////
// [ApiController]
// [Route("api/[controller]")]
// public class UsersController : ControllerBase
// {
//     [HttpPatch("updateRole")]
//     public async Task<IActionResult> UpdateUserRole([FromBody] UpdateRoleRequest request)
//     {
//         if (request == null || string.IsNullOrEmpty(request.UserId) || string.IsNullOrEmpty(request.NewRole))
//         {
//             return BadRequest("Invalid request data.");
//         }

//         // Logic to update the user role in the database
//         bool success = await UpdateRoleInDatabase(request.UserId, request.NewRole);

//         if (success)
//         {
//             return Ok("Role updated successfully.");
//         }
//         else
//         {
//             return StatusCode(500, "Failed to update role.");
//         }
//     }

//     private Task<bool> UpdateRoleInDatabase(string userId, string newRole)
//     {
//         // Your logic to update the role in the database
//         return Task.FromResult(true); // Simulate a successful update
//     }
// }

// public class UpdateRoleRequest
// {
//     public string UserId { get; set; }
//     public string NewRole { get; set; }
// }


///////////////////////////////////////NEXTJS FRONTEND/////////////////////////////////////////////////////
// import { useState } from 'react';

// const RoleUpdateForm = () => {
//     const [userId, setUserId] = useState('');
//     const [newRole, setNewRole] = useState('');
//     const [responseMessage, setResponseMessage] = useState('');

//     const handleSubmit = async (event: React.FormEvent) => {
//         event.preventDefault();

//         const response = await fetch('/api/updateRole', {
//             method: 'PATCH',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({ userId, newRole }),
//         });

//         const result = await response.json();
//         setResponseMessage(result.message || 'An error occurred');
//     };

//     return (
//         <form onSubmit={handleSubmit}>
//             <div>
//                 <label htmlFor="userId">User ID</label>
//                 <input
//                     type="text"
//                     id="userId"
//                     value={userId}
//                     onChange={(e) => setUserId(e.target.value)}
//                     required
//                 />
//             </div>
//             <div>
//                 <label htmlFor="newRole">New Role</label>
//                 <input
//                     type="text"
//                     id="newRole"
//                     value={newRole}
//                     onChange={(e) => setNewRole(e.target.value)}
//                     required
//                 />
//             </div>
//             <button type="submit">Update Role</button>
//             {responseMessage && <p>{responseMessage}</p>}
//         </form>
//     );
// };

// export default RoleUpdateForm;
