## Process population and reported cases files and gets data per million inhabitants
#- Files produced: 
#- Cases per million inhabitants by variable and date
#- Population by country
import pandas as pd
import numpy as np

def process_data(data,population):

    population_admin=population.groupby(['NAME_0','NAME_1']).Population_mean.sum().reset_index().rename(columns={'NAME_0':'name_0','NAME_1':'name_1'})

    data['year']=data.ly_yr.apply(str)
    data=data.loc[~data.ly_month.isna()]
    data['month']=data.ly_month
    data['month']=data['month'].apply(int).apply(str).str.zfill(2)

    data['month_year']=data['year']+"-"+data['month']
    data.loc[:,['tar_wrongdoing', 'pe_approxnumber','pe_violence','tar_outcome']]=data.loc[:,['tar_wrongdoing', 'pe_approxnumber','pe_violence','tar_outcome']].fillna(-1)
    data=data.groupby(['name_0', 'name_1','month_year','tar_wrongdoing', 'pe_approxnumber','pe_violence','tar_outcome']).id.count().reset_index()

    month_year=data.loc[:,['month_year']].drop_duplicates().reset_index(drop=True)
    regions=data.loc[:,['name_0','name_1']].drop_duplicates().reset_index(drop=True)
    regions['tmp'] = 1
    month_year['tmp'] = 1
    df = pd.merge(regions, month_year, on=['tmp'])
    df = df.drop('tmp', axis=1)
    
    data=df.merge(data,on=['name_0','name_1','month_year'],how='left')
    data['id']=data['id'].fillna(0)
    data.loc[:,['tar_wrongdoing', 'pe_approxnumber','pe_violence','tar_outcome']]=data.loc[:,['tar_wrongdoing', 'pe_approxnumber','pe_violence','tar_outcome']].fillna(-1)
    data.name_1=data.name_1.replace("Chimaltenullgo","Chimaltenango")
    data.name_1=data.name_1.replace("Huehuetenullgo","Huehuetenango")
    data.name_1=data.name_1.replace("Quetzaltenullgo","Quetzaltenango")

    data=data.merge(population_admin,on=['name_0','name_1'],how='left')

    ## data per million inhabitants
    data['events_pop']=data['id']/(data['Population_mean']/1e6)

    data=data.dropna()

    data['month_year']=data['month_year'].apply(str)

    data['month_year']=data['month_year']+"-01"
    return data
def main():
    data_path="./src/data/"
    data=pd.read_excel(data_path+"LYLA 2022-9-21.xlsx")
    population=pd.read_csv(data_path+"LatinAmerica_geo_variables_provinces.csv",encoding='latin-1')
    data=process_data(data,population)
    data.to_json(data_path+"data_agg.json",orient='records')
    
    ## population country level
    pop_name0=data.loc[:,['name_0','Population_mean']].drop_duplicates().groupby(['name_0']).Population_mean.sum().reset_index()
    pop_name0=pop_name0.pivot_table(aggfunc=np.sum,columns='name_0')
    pop_name0.to_json(data_path+"population_admin0.json",orient='records')
    
if __name__ == '__main__':
    main()