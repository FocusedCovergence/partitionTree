
import numpy as np
import plotly.express as px
import streamlit as st
import matplotlib.pyplot as plt
import pandas as pd


# In[95]:


num_to_see = np.loadtxt('starting_number.txt')
num_to_see = int(num_to_see)
limit = num_to_see
numbers = [0] * (limit + 1)
numbers[0] = [[0]]
numbers[1] = [[1]]
for i in range(2,(limit + 1)):
    partitions = []
    partitions.append([i])
    for j in range (1, int(np.floor(i/2)) + 1):
        current = numbers[i-j]
        for partition in current:
            if partition[0] >= j:
                to_add = partition.copy()
                to_add.append(j)
                to_add.sort()
                partitions.append(to_add)
    numbers[i] = partitions


# In[16]:





# In[11]:


def calculate_new_partitions(numbers, new_amount):
    current_partitions = len(numbers)
    for i in range(current_partitions,(new_amount + 1)):
        partitions = []
        partitions.append([i])
        for j in range (1, int(np.floor(i/2)) + 1):
            current = numbers[i-j]
            for partition in current:
                if partition[0] >= j:
                    to_add = partition.copy()
                    to_add.append(j)
                    to_add.sort()
                    partitions.append(to_add)
        numbers.append(partitions)
    print(len(numbers[len(numbers) - 1]))


# In[93]:


num_to_see = np.loadtxt('starting_number.txt')
num_to_see = int(num_to_see)
partitions_vis = st.container()

with partitions_vis:

    columns = st.columns([1, 1, 1])
    
    with columns[0]:
        if st.button('Next Number', 1):
            array = [[num_to_see + 1]]
            np.savetxt('starting_number.txt', array)
            num_to_see = np.loadtxt('starting_number.txt')
            num_to_see = int(num_to_see)
        else:
            num_to_see = num_to_see
    with columns[1]:
        if st.button('Previous Number', 2):
            array = [[num_to_see - 1]]
            np.savetxt('starting_number.txt', array)
            num_to_see = np.loadtxt('starting_number.txt')
            num_to_see = int(num_to_see)            
        else:
            num_to_see = num_to_see
    chart1, chart2 = st.columns([2,3])

    with chart1:        
        if (num_to_see >= len(numbers)):
            calculate_new_partitions(numbers, num_to_see)
        partitions = numbers[num_to_see]
        names_temp = []
        values_temp = []
        parents_temp = []
        num = 0
        for i in range(1, num_to_see + 1):
            names_temp.append(str("Partitions of Size " + str(i)))
            values_temp.append(0)
            parents_temp.append("")
        for i in range(len(partitions)):
            partition = partitions[i]
            name = "Partition "
            name = name + str(i + 1)
            names_temp.append(name)
            parent_name = str("Partitions of Size " + str(len(partition)))
            values_temp.append(0)
            parents_temp.append(parent_name)
            for j in range(len(partition)):
                current_num = partition[j]
                name_to_add = str(num)
                num += 1
                names_temp.append(name_to_add)
                values_temp.append(current_num)
                parents_temp.append(name)
        fig = px.treemap(
        names = names_temp,
        values = values_temp,
        parents = parents_temp
        )
        fig.data[0]['textfont']['color'] = "red"
        fig.update_traces(root_color="black")
        fig.update_layout(margin = dict(t=50, l=25, r=25, b=25))
        fig.data[0].texttemplate = "%{value}"
        st.markdown("<div style='background:#e6e6e6'><h3 style='font-weight:bold; color:#ac2217'>Partitions of " + str(num_to_see) + "</h3></div>", unsafe_allow_html=True)
        st.plotly_chart(fig)
        


# In[ ]:





# In[82]:





# In[ ]:




