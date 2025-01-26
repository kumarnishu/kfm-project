import React, { useContext, useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { AuthenticatedStackParamList } from '../../navigation/AppNavigator';
import { useQuery } from 'react-query';
import { AxiosResponse } from 'axios';
import { GetServiceRequestDetailedDto } from '../../dto/ServiceRequestDto';
import { BackendError } from '../../..';
import { GetServiceRequest } from '../../services/ServiceRequestService';
import { ActivityIndicator, Button, Divider, Surface, Text } from 'react-native-paper';
import Video from 'react-native-video';
import ViewMediaDialog from '../../components/ViewMediaDialog';
import SelectMediaComponent from '../../components/SelectMediaComponent';
import { Asset } from 'react-native-image-picker';
import { UserContext } from '../../contexts/UserContext';

type Props = StackScreenProps<AuthenticatedStackParamList, 'ServiceRequestDetailsScreen'>;

const ServiceRequestDetailsScreen: React.FC<Props> = ({ route, navigation }) => {
  const { id } = route.params;
  const { user } = useContext(UserContext)
  const [files, setFiles] = useState<{ asset: Asset | null, id: number }[]>([]);
  const [dialog, setDialog] = useState<string>();
  const [media, setMedia] = useState<{ type: 'video' | 'photo'; url: string }>();
  const [request, setRequest] = useState<GetServiceRequestDetailedDto>();
  const { data, isSuccess, isLoading, refetch, isError } = useQuery<
    AxiosResponse<GetServiceRequestDetailedDto>,
    BackendError
  >(['request-detailed', id], async () => GetServiceRequest({ id: id }));


  useEffect(() => {
    if (isSuccess && data)
      setRequest(data.data);
  }, [isSuccess, data]);

  if (isLoading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#6200ea" />
        <Text>Loading Request...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.loader}>
        <Text>Failed to load requests. Please try again later.</Text>
        <Button mode="contained" onPress={() => refetch()}>
          Retry
        </Button>
      </View>
    );
  }

  const handleMediaPress = (type: 'video' | 'photo', url: string) => {
    setMedia({ type, url });
    setDialog('ViewMediaDialog');
  };

  const renderVideosandphotos = ({ item }: { item: string }) => {
    const isVideo = item.endsWith('.mp4') || item.endsWith('.mov'); // Check if the item is a video
    return (
      <>
        {isVideo ? (
          <Video
            onTouchStart={() => {
              handleMediaPress('video', item)
            }}
            source={{ uri: item }}
            style={styles.mediaItem}
            resizeMode="cover"
            controls={false}
            paused={true}
          />
        ) : (
          <TouchableOpacity onPress={() => {
            handleMediaPress('photo', item)
          }}>
            <Image height={100}
              source={{ uri: item }} style={styles.mediaItem} />
          </TouchableOpacity>
        )}
      </>
    );
  };

  const problemmediaItems = [
    ...(request?.problem.photos || []),
    ...(request?.problem.videos || []),
  ];

  const solutionmediaItems = [
    ...(request?.solution?.photos || []),
    ...(request?.solution?.videos || []),
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{request?.request_id}</Text>
      <Divider />
      <Text style={styles.sectionTitle}>Problems with attached media by Customer</Text>
      <FlatList
        data={problemmediaItems}
        keyExtractor={(item, index) => `problem-media-${index}`}
        renderItem={renderVideosandphotos}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.listContent}
      />
      

      {!request?.assigned_engineer && <Button style={{ marginVertical: 50 }} labelStyle={{ fontSize: 20 }}>Assign Engineer</Button>}
      {
        request?.assigned_engineer && <>
          <Text style={styles.sectionTitle}>Solutions with attached media by Engineer</Text>
          {!request?.solution && user?.role == "engineer" &&<SelectMediaComponent files={files} setFiles={setFiles} />}
        </>
      }
      <FlatList
        data={solutionmediaItems}
        keyExtractor={(item, index) => `solution-media-${index}`}
        renderItem={renderVideosandphotos}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.listContent}
      />
      {user?.role == "engineer" || user?.role == 'admin' &&
        <>
          {request?.assigned_engineer && request?.solution && (
            <Button mode="contained">Close Request</Button>
          )}

        </>
      }
      {media && <ViewMediaDialog dialog={dialog} setDialog={setDialog} media={media} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginVertical: 8,
  },
  listContent: {
    paddingBottom: 16,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  mediaItem: {
    width: '48%', // Two items per row with spacing
    aspectRatio: 16 / 9,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
  },
});

export default ServiceRequestDetailsScreen;
