import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API = "http://localhost:4000/";

const initialState = {
  loading: false,
  fetchChatSuccess: false,
  allchat: [],
  allUser:[],
  allUserSuccess:false,
  createGroupSuccess:false,
  createGroupData:[],
  fetchChats:[],
  fetchMessageSuccess:false,
  sendMesageToBackSuccess:false,
  sendMesageToBackData:[]
};


export const accessChat = createAsyncThunk("accessChat", async (userId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API}chats/?userId=${userId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },

    });

    if (!response.ok) {
      // Handle non-2xx responses
      throw new Error("Failed to fetch chat data");
    }

    const data = await response.json();
    console.log('Response:', data);
    return data;
  } catch (error) {
    // Handle errors
    console.error('Error:', error);
    throw error;
  }
});



export const fetchChat = createAsyncThunk("fetchChat", async (body, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');
      const result = await fetch(`${API}chats/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
      });
  
      if (!result.ok) {
        // Handle non-2xx responses
        throw new Error("Failed to fetch chat data");
      }
  
      const data = await result.json();

      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  });
  

  export const allUserList = createAsyncThunk("allUserList", async () => {
    try {
      const token = localStorage.getItem('token');
      const result = await fetch(`${API}users/list`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
      });
  
      if (!result.ok) {

        throw new Error("Failed to fetch chat data");
      }
  
      const data = await result.json();

      return data;
    } catch (error) {
        
    }
  });


  export const createGroup = createAsyncThunk("createGroup", async ({ selectedUsers,selectedUsersId, chatName }) => {
    try {
      const token = localStorage.getItem('token');
      const result = await fetch(`${API}chats/group`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ selectedUsers,selectedUsersId, chatName }) 
      });
  
      if (!result.ok) {
        throw new Error("Failed to fetch chat data");
      }
  
      const data = await result.json();
  
      return data;
    } catch (error) {
      // Handle error
    }
  });

  export const RemoveusercreateGroup = createAsyncThunk("RemoveusercreateGroup", async ({ userId,chatId}) => {
    try {
      const token = localStorage.getItem('token');
      const result = await fetch(`${API}chats/groupremove`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ userId ,chatId}) 
      });
  
      if (!result.ok) {
        throw new Error("Failed to fetch chat data");
      }
  
      const data = await result.json();
  
      return data;
    } catch (error) {

    }
  });
  

  export const AddusercreateGroup = createAsyncThunk("AddusercreateGroup", async ({ userId,chatId}) => {
    try {
      console.log(userId,chatId)
      const token = localStorage.getItem('token');
      const result = await fetch(`${API}chats/groupadd`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ userId ,chatId}) 
      });
  
      if (!result.ok) {
        throw new Error("Failed to fetch chat data");
      }
  
      const data = await result.json();
  
      return data;
    } catch (error) {

    }
  });

  export const sendMesageToBack = createAsyncThunk("sendMesageToBack", async ({ content ,chatId}) => {
    try {
      const token = localStorage.getItem('token');
      const result = await fetch(`${API}message/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ content ,chatId}) 
      });
  
      if (!result.ok) {
        throw new Error("Failed to fetch chat data");
      }
  
      const data = await result.json();
      console.log('data',data);
  
      return data;
    } catch (error) {

    }
  });

  export const fetchAllChat = createAsyncThunk("fetchAllChat", async (chatId) => {
    try {

      if(!chatId)
      return ;
      const token = localStorage.getItem('token');
      const result = await fetch(`${API}message?chatId=${chatId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }, 
      });
  
      if (!result.ok) {
        throw new Error("Failed to fetch chat data");
      }
  
      const data = await result.json();
  
      return data;
    } catch (error) {

    }
  });




const chatSlice = createSlice({
  name: "Chat",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchChat.fulfilled, (state, action) => {
        state.loading = false;

        if (action.payload.error) {
          state.loading = true;
          state.fetchChatSuccess = action.payload.success;
        } else {
          state.loading = false;
          state.fetchChatSuccess = action.payload.success;
          state.allchat = action.payload.data;
        }
      })
      .addCase(fetchChat.pending, (state) => {
        state.loading = true;
        state.fetchChatSuccess = false;
      })
      .addCase(fetchChat.rejected, (state) => {
        state.loading = true;
        state.fetchChatSuccess = false;
      })
      .addCase(allUserList.pending, (state) => {
        state.loading = true;
        state.allUserSuccess = false;
      })
      .addCase(allUserList.fulfilled, (state, action) => {
        state.loading = false;

        if (action?.payload?.error) {
          state.loading = true;
          state.allUserSuccess = action.payload.success;
        } else {
          state.loading = false;
          state.allUserSuccess = action?.payload?.success;
          state.allUser = action?.payload?.data;
        }
      })
     
      .addCase(allUserList.rejected, (state) => {
        state.loading = true;
        state.allUserSuccess = false;
      })
      .addCase(createGroup.fulfilled, (state, action) => {
        state.loading = false;

        if (action.payload.error) {
          state.loading = true;
          state.createGroupSuccess = action.payload.success;
        } else {
          state.loading = false;
          state.createGroupSuccess = action.payload.success;
          state.createGroupData = action.payload.data;
        }
      })
      .addCase(createGroup.pending, (state) => {
        state.loading = true;
        state.createGroupSuccess = false;
      })
      .addCase(createGroup.rejected, (state) => {
        state.loading = true;
        state.createGroupSuccess = false;
      })
      .addCase(fetchAllChat.pending, (state) => {
        state.loading = true;
        state.fetchMessageSuccess = false;
      })
      .addCase(fetchAllChat.fulfilled, (state, action) => {
        state.loading = false;

        if (action?.payload?.error) {
          state.loading = true;
          state.fetchMessageSuccess = action.payload.success;
        } else {
          state.loading = false;
          state.fetchMessageSuccess = action?.payload?.success;
          state.fetchChats = action?.payload?.data;
        }
      })
     
      .addCase(fetchAllChat.rejected, (state) => {
        state.loading = true;
        state.fetchMessageSuccess = false;
      })
      .addCase(sendMesageToBack.pending, (state) => {
        state.loading = true;
        state.sendMesageToBackSuccess = false;
      })
      .addCase(sendMesageToBack.fulfilled, (state, action) => {
        state.loading = false;

        if (action?.payload?.error) {
          state.loading = true;
          state.sendMesageToBackSuccess = action.payload.success;
        } else {
          state.loading = false;
          state.sendMesageToBackSuccess = action?.payload?.success;
          state.sendMesageToBackData = action?.payload?.data;
        }
      })
     
      .addCase(sendMesageToBack.rejected, (state) => {
        state.loading = true;
        state.sendMesageToBackSuccess = false;
      })




      
      
  },
});

export default chatSlice.reducer;
